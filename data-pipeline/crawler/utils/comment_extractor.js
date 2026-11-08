// utils/comment_extractor.js
import crypto from "crypto";

/**
 * Creates a unique deterministic hash ID if a comment doesn't have a distinct ID.
 */
function generateFallbackCommentId(postId, author, content, commentedAt) {
  const raw = `${postId}_${author}_${content}_${commentedAt}`;
  return crypto.createHash("md5").update(raw).digest("hex");
}

/**
 * Recursively extracts comments from Facebook GraphQL response chunks.
 * Accurately tracks parent_comment_id through nested GraphQL nodes.
 *
 * @param {Object} node - The current GraphQL JSON node.
 * @param {Array} commentsArray - Accumulator array to store extracted comments.
 * @param {string} targetPostId - The post_id to associate these comments with.
 * @param {string} crawledAt - Timestamp when crawling started.
 * @param {string|null} parentId - Parent comment ID if traversing replies.
 */
export function extractCommentsFromGraphQL(
  node,
  commentsArray,
  targetPostId,
  crawledAt,
  parentId = null,
) {
  if (Array.isArray(node)) {
    for (const item of node) {
      extractCommentsFromGraphQL(
        item,
        commentsArray,
        targetPostId,
        crawledAt,
        parentId,
      );
    }
    return;
  }

  if (typeof node !== "object" || node === null) return;

  // Detect a Comment node in Facebook GraphQL payload
  const isCommentNode =
    node.__typename === "Comment" ||
    (node.body && node.author && node.created_time);

  let currentCommentId = null;

  if (isCommentNode) {
    try {
      const content = node.body?.text ? node.body.text.trim() : "";

      if (content) {
        // Author extraction
        let author = "Sinh viên ẩn danh";
        if (node.author?.name) {
          author = node.author.name.trim();
        }

        // Timestamp
        let commentedAt = crawledAt;
        if (node.created_time) {
          commentedAt = new Date(node.created_time * 1000).toISOString();
        }

        // Reaction count
        let reactionCount = 0;
        if (typeof node.feedback?.reaction_count === "number") {
          reactionCount = node.feedback.reaction_count;
        } else if (typeof node.feedback?.reactors?.count === "number") {
          reactionCount = node.feedback.reactors.count;
        }

        // Comment ID
        currentCommentId =
          node.id ||
          generateFallbackCommentId(targetPostId, author, content, commentedAt);

        // Detect parent ID: from direct field references OR from caller context
        const detectedParentId =
          node.parent_comment?.id ||
          node.reply_to_comment?.id ||
          node.in_reply_to?.id ||
          node.comment_parent?.id ||
          node.feedback?.parent_feedback?.id ||
          parentId ||
          null;

        commentsArray.push({
          comment_id: String(currentCommentId),
          post_id: String(targetPostId),
          parent_comment_id: detectedParentId ? String(detectedParentId) : null,
          author,
          content,
          reaction_count: reactionCount,
          commented_at: commentedAt,
          crawled_at: crawledAt,
        });
      }
    } catch (e) {
      // Ignore individual comment extraction error
    }
  }

  // Determine the effective parentId for nested children:
  // If this node was a comment itself, its children belong to this comment!
  const effectiveParentId = currentCommentId || parentId;

  // Traverse all child objects
  for (const [key, value] of Object.entries(node)) {
    // Specifically inspect reply containers
    if (
      key === "replies" ||
      key === "display_comments" ||
      key === "threaded_comments" ||
      key === "comment_replies" ||
      key === "sub_comments"
    ) {
      extractCommentsFromGraphQL(
        value,
        commentsArray,
        targetPostId,
        crawledAt,
        effectiveParentId,
      );
    } else {
      extractCommentsFromGraphQL(
        value,
        commentsArray,
        targetPostId,
        crawledAt,
        effectiveParentId,
      );
    }
  }
}

/**
 * Post-processing step: Reconstructs parent-child relationships using:
 * 1. Already discovered parent_comment_id
 * 2. Mention / Reply Tag recognition at the start of comments (e.g. "@AuthorName ...")
 *
 * @param {Array} comments - Array of extracted comments for a post.
 * @returns {Array} - Enriched comments array with parent_comment_id linked.
 */
export function linkCommentHierarchy(comments) {
  if (!Array.isArray(comments) || comments.length === 0) return [];

  // Map author names to their latest comment ID for reply linking
  const authorToCommentMap = new Map();

  // Sort by commented_at ascending to process in chronological order
  const sorted = [...comments].sort((a, b) => {
    return new Date(a.commented_at) - new Date(b.commented_at);
  });

  return sorted.map((c) => {
    // If parent_comment_id already exists and is not equal to itself, keep it
    if (c.parent_comment_id && c.parent_comment_id !== c.comment_id) {
      authorToCommentMap.set(c.author.toLowerCase(), c.comment_id);
      return c;
    }

    // Check if the comment starts with or mentions a previous author (Facebook automatic reply tagging)
    const content = c.content.trim();
    let linkedParentId = null;

    for (const [authorName, commentId] of authorToCommentMap.entries()) {
      if (authorName.length > 2 && commentId !== c.comment_id) {
        // Facebook replies often start with "AuthorName ..." or "@AuthorName ..."
        if (
          content.toLowerCase().startsWith(authorName) ||
          content.toLowerCase().startsWith(`@${authorName}`)
        ) {
          linkedParentId = commentId;
          break;
        }
      }
    }

    // Update map with this author's latest comment
    authorToCommentMap.set(c.author.toLowerCase(), c.comment_id);

    return {
      ...c,
      parent_comment_id: linkedParentId || c.parent_comment_id || null,
    };
  });
}

/**
 * Fallback DOM extractor that reads visible comments and preserves nested hierarchy.
 *
 * @param {import('playwright').Page} page - Playwright page.
 * @param {string} targetPostId - Parent post ID.
 * @param {string} crawledAt - Timestamp when crawl started.
 * @returns {Promise<Array>}
 */
export async function extractCommentsFromDOM(page, targetPostId, crawledAt) {
  try {
    const rawComments = await page.evaluate(
      ({ targetPostId, crawledAt }) => {
        const results = [];

        // Find comment threads (ul > li or top-level comment blocks)
        const commentArticles = document.querySelectorAll('div[role="article"]');

        commentArticles.forEach((el) => {
          try {
            // Find author
            const authorEl =
              el.querySelector("span[dir='auto'] strong") ||
              el.querySelector("a[role='link'] span") ||
              el.querySelector("h3") ||
              el.querySelector("a span");
            const author = authorEl ? authorEl.textContent.trim() : "Sinh viên ẩn danh";

            // Find content
            const textContainers = el.querySelectorAll("div[dir='auto'], span[dir='auto']");
            let content = "";
            textContainers.forEach((tc) => {
              const text = tc.textContent.trim();
              if (text && text !== author && text.length > content.length) {
                content = text;
              }
            });

            if (!content || content === author) return;

            // Find reactions
            let reactions = 0;
            const reactEl = el.querySelector(
              "span[aria-label*='thích'], span[aria-label*='like'], span[aria-label*='cảm xúc']",
            );
            if (reactEl) {
              const match = reactEl.getAttribute("aria-label").match(/\d+/);
              if (match) reactions = parseInt(match[0], 10);
            }

            // Check nesting level: if this article is inside another article or an inner ul
            const isNested = el.parentElement?.closest('div[role="article"]') !== null ||
                             el.closest('ul ul') !== null;

            results.push({
              author,
              content,
              reaction_count: reactions,
              isNested,
              targetPostId,
              crawledAt,
            });
          } catch (e) {}
        });

        return results;
      },
      { targetPostId, crawledAt },
    );

    let lastTopLevelId = null;

    return rawComments.map((item) => {
      const commentId = generateFallbackCommentId(
        targetPostId,
        item.author,
        item.content,
        crawledAt,
      );

      let parentId = null;
      if (item.isNested && lastTopLevelId) {
        parentId = lastTopLevelId;
      } else {
        lastTopLevelId = commentId;
      }

      return {
        comment_id: commentId,
        post_id: String(targetPostId),
        parent_comment_id: parentId,
        author: item.author,
        content: item.content,
        reaction_count: item.reaction_count,
        commented_at: crawledAt,
        crawled_at: crawledAt,
      };
    });
  } catch (err) {
    console.warn("⚠️ DOM comments extraction fallback warning:", err.message);
    return [];
  }
}
