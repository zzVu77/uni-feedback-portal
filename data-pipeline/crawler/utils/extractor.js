/**
 * Utility for extracting post data from Facebook's GraphQL responses.
 */

/**
 * Traverses an object to find the highest counts for reactions and comments.
 * It recursively searches for keys related to reactions, likes, and comments.
 * 
 * @param {Object} node - The object node to search.
 * @returns {Object} - An object containing reactions and comments counts.
 */
export function extractPostStats(node) {
  let maxComments = 0;
  let maxReactions = 0;

  function traverse(o) {
    if (o === null || typeof o !== "object") return;

    for (const [k, v] of Object.entries(o)) {
      const key = k.toLowerCase();

      // Extract Comments count
      if (key.includes("comment")) {
        if (typeof v === "number" && key.includes("count") && v > maxComments) {
          maxComments = v;
        } else if (v && typeof v.count === "number" && v.count > maxComments) {
          maxComments = v.count;
        } else if (v && typeof v.total_count === "number" && v.total_count > maxComments) {
          maxComments = v.total_count;
        }
      }

      // Extract Reactions/Likes count
      if (key.includes("reaction") || key.includes("like")) {
        if (typeof v === "number" && key.includes("count") && v > maxReactions) {
          maxReactions = v;
        } else if (v && typeof v.count === "number" && v.count > maxReactions) {
          maxReactions = v.count;
        } else if (v && typeof v.total_count === "number" && v.total_count > maxReactions) {
          maxReactions = v.total_count;
        }
      }

      // Recursively traverse child objects
      if (typeof v === "object") {
        traverse(v);
      }
    }
  }

  traverse(node);
  return { reactions: maxReactions, comments: maxComments };
}

/**
 * Recursively searches for and extracts post data from a GraphQL node.
 * 
 * @param {Object} node - The GraphQL response node to process.
 * @param {Array} postsArray - The array to store extracted posts.
 * @param {string} crawledAt - The timestamp when the crawl started.
 */
export function extractPostsRecursively(node, postsArray, crawledAt) {
  if (Array.isArray(node)) {
    node.forEach((n) => extractPostsRecursively(n, postsArray, crawledAt));
    return;
  }

  if (typeof node !== "object" || node === null) return;

  // Identify a post node (either Story or a node with comet_sections and post_id)
  if (node.__typename === "Story" || (node.comet_sections && node.post_id)) {
    try {
      // 1. Extract content
      let content = "";
      if (node.message && node.message.text) {
        content = node.message.text;
      } else if (node.comet_sections?.content?.story?.message?.text) {
        content = node.comet_sections.content.story.message.text;
      }

      if (content) {
        // 2. Extract Author
        let author = "Unknown";
        const actors =
          node.actors ||
          node.comet_sections?.context_layout?.story?.comet_sections
            ?.actor_photo?.story?.actors;
        if (actors && actors.length > 0 && actors[0].name) {
          author = actors[0].name;
        }

        // 3. Extract Post Link
        let postLink = node.url || "";
        if (!postLink) {
          postLink =
            node.comet_sections?.context_layout?.story?.comet_sections
              ?.metadata?.[0]?.story?.url || "";
        }
        if (postLink && postLink.includes("?")) {
          postLink = postLink.split("?")[0];
        }

        // 4. Extract Post Date
        let postDate = "";
        const creationTime =
          node.creation_time ||
          node.comet_sections?.context_layout?.story?.comet_sections
            ?.metadata?.[0]?.story?.creation_time;
        if (creationTime) {
          postDate = new Date(creationTime * 1000).toISOString();
        }

        // 5. Extract statistics using aggressive traversal
        const stats = extractPostStats(node);

        postsArray.push({
          author,
          post_date: postDate,
          post_link: postLink,
          content,
          stats: {
            reactions: stats.reactions.toString(),
            comments: stats.comments.toString(),
          },
          crawled_at: crawledAt,
        });
      }
    } catch (e) {
      // Ignore extraction errors for individual nodes
    }
  }

  // Recursively search for more Story objects in all children
  Object.values(node).forEach((val) => extractPostsRecursively(val, postsArray, crawledAt));
}
