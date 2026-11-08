// crawler_comments.js
import "dotenv/config";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { initBrowser } from "./utils/browser.js";
import { AUTH_FILE } from "./constants.js";
import {
  extractCommentsFromGraphQL,
  extractCommentsFromDOM,
  linkCommentHierarchy,
} from "./utils/comment_extractor.js";
import { BigQuery } from "@google-cloud/bigquery";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "output");

/**
 * Computes deterministic post_id from post_link matching dbt MD5 logic.
 */
function computePostId(postLink, author = "", content = "") {
  const target = postLink || `${author}${content}`;
  return crypto.createHash("md5").update(target).digest("hex");
}

/**
 * Validates authentication session.
 */
function validateAuth() {
  if (!fs.existsSync(AUTH_FILE)) {
    console.error(`❌ ${AUTH_FILE} not found. Please run 'npm run auth' first!`);
    return false;
  }
  return true;
}

/**
 * Retrieves target posts to crawl comments.
 * 1. CLI args: --urls <url1> <url2>
 * 2. BigQuery (if configured): Fetch negative/critical posts needing comment inspection
 * 3. Fallback: Most recent posts file in output/
 */
async function getTargetPosts() {
  const args = process.argv.slice(2);

  // 1. Direct URLs passed from CLI
  if (args.length > 0) {
    const urls = args.filter((arg) => arg.startsWith("http"));
    if (urls.length > 0) {
      console.log(`🎯 Received ${urls.length} target URLs from CLI arguments.`);
      return urls.map((url) => ({
        post_link: url,
        post_id: computePostId(url),
      }));
    }
  }

  // 2. Query BigQuery for Negative or High-Risk Posts
  try {
    console.log("🔍 Checking BigQuery for high-risk / negative posts needing comments...");
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const bqOptions = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT || "uni-feedback-data",
    };
    if (keyPath && fs.existsSync(keyPath)) {
      bqOptions.keyFilename = keyPath;
    }
    const bq = new BigQuery(bqOptions);

    const query = `
      SELECT post_id, post_link, sentiment_label, comment_count
      FROM \`uni-feedback-data.uni_feedback_data_marts.mrt_trending_issues_dashboard\`
      WHERE (sentiment_label IN ('Tiêu cực', 'Stress lo âu') OR sentiment_score <= -0.5)
        AND post_link IS NOT NULL
        AND post_link != ''
        AND comment_count > 0
      ORDER BY posted_at DESC
      LIMIT 10
    `;

    const [rows] = await bq.query(query);
    if (rows && rows.length > 0) {
      console.log(`🎯 Found ${rows.length} high-risk posts from BigQuery for comment crawling.`);
      return rows.map((r) => ({
        post_link: r.post_link,
        post_id: r.post_id,
      }));
    }
  } catch (err) {
    console.warn("⚠️ BigQuery query for critical posts skipped:", err.message);
  }

  // 3. Fallback: Parse latest posts_*.json from crawler output
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs
      .readdirSync(OUTPUT_DIR)
      .filter((f) => f.startsWith("posts_") && f.endsWith(".json"))
      .sort()
      .reverse();

    if (files.length > 0) {
      const latestFile = path.join(OUTPUT_DIR, files[0]);
      console.log(`📂 Fallback: Reading posts from latest output file: ${files[0]}`);
      const posts = JSON.parse(fs.readFileSync(latestFile, "utf-8"));
      const validPosts = posts
        .filter((p) => p.post_link && p.post_link.includes("facebook.com"))
        .slice(0, 5) // Crawl comments for top 5 recent posts
        .map((p) => ({
          post_link: p.post_link,
          post_id: computePostId(p.post_link, p.author, p.content),
        }));

      if (validPosts.length > 0) {
        return validPosts;
      }
    }
  }

  return [];
}

/**
 * Switches comment filter to "All comments" on Facebook post.
 */
async function selectAllCommentsFilter(page) {
  try {
    // Look for filter button: "Phù hợp nhất", "Most relevant", "Bình luận hàng đầu"
    const filterSelectors = [
      'div[role="button"]:has-text("Phù hợp nhất")',
      'div[role="button"]:has-text("Most relevant")',
      'div[role="button"]:has-text("Bình luận hàng đầu")',
      'div[role="button"]:has-text("Top comments")',
    ];

    let clickedFilter = false;
    for (const selector of filterSelectors) {
      const btn = page.locator(selector).first();
      if ((await btn.count()) > 0 && (await btn.isVisible())) {
        await btn.click({ timeout: 4000 });
        clickedFilter = true;
        break;
      }
    }

    if (clickedFilter) {
      await page.waitForTimeout(1000);
      // Select option "Tất cả bình luận" / "All comments"
      const allOption = page
        .locator(
          'div[role="menuitem"]:has-text("Tất cả bình luận"), div[role="menuitem"]:has-text("All comments")',
        )
        .first();

      if ((await allOption.count()) > 0) {
        await allOption.click({ timeout: 4000 });
        console.log("   ✅ Switched filter to: [Tất cả bình luận / All comments]");
        await page.waitForTimeout(2000);
      }
    }
  } catch (e) {
    // Non-blocking: some post layouts already show all comments
  }
}

/**
 * Clicks 'See more' text buttons to expand long comment contents.
 */
async function expandLongCommentText(page) {
  try {
    const seeMoreButtons = page.locator(
      'div[role="article"] div[role="button"]:has-text("Xem thêm"), ' +
      'div[role="article"] div[role="button"]:has-text("See more")',
    );
    const count = await seeMoreButtons.count();
    for (let i = 0; i < Math.min(count, 15); i++) {
      const btn = seeMoreButtons.nth(i);
      if (await btn.isVisible()) {
        await btn.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(300);
      }
    }
  } catch (e) {}
}

/**
 * Deep recursive expansion of comments and ALL nested replies (including 1.1 -> 1.1.1, previous replies, etc.)
 */
async function expandComments(page, maxPasses = 25) {
  console.log(`   🔄 Starting Deep Nested Comment Expansion (up to ${maxPasses} passes)...`);

  let totalClicked = 0;

  for (let pass = 1; pass <= maxPasses; pass++) {
    try {
      // 1. Selector covering ALL Facebook reply patterns:
      // - Top-level: "Xem thêm bình luận", "Xem các bình luận trước"
      // - Direct replies: "Xem 5 câu trả lời", "1 phản hồi", "View replies"
      // - Nested replies: "Xem câu trả lời trước đó", "Xem thêm 3 phản hồi khác", "View previous replies"
      const expandButtons = page.locator(
        'div[role="button"]:has-text("Xem thêm bình luận"), ' +
        'div[role="button"]:has-text("View more comments"), ' +
        'div[role="button"]:has-text("Xem các bình luận trước"), ' +
        'div[role="button"]:has-text("View previous comments"), ' +
        'div[role="button"]:has-text("câu trả lời"), ' +
        'div[role="button"]:has-text("phản hồi"), ' +
        'div[role="button"]:has-text("replies"), ' +
        'div[role="button"]:has-text("reply")'
      );

      const count = await expandButtons.count();
      if (count === 0) {
        console.log(`   ✨ No more expand buttons found. Finished deep expansion at pass ${pass}.`);
        break;
      }

      let clickedInThisPass = 0;

      for (let i = 0; i < count; i++) {
        try {
          const btn = expandButtons.nth(i);
          if (await btn.isVisible()) {
            const btnText = (await btn.textContent()).trim();

            // Scroll button into view so Facebook triggers lazy loading & click doesn't miss
            await btn.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
            await page.waitForTimeout(400);

            await btn.click({ timeout: 3000 }).catch(() => {});
            clickedInThisPass++;
            totalClicked++;

            // Wait for Facebook to fetch nested GraphQL replies
            await page.waitForTimeout(1400);
          }
        } catch (err) {
          // Continue to next button if one fails
        }
      }

      if (clickedInThisPass === 0) {
        // If buttons exist but none visible, try small scroll
        await page.keyboard.press("PageDown");
        await page.waitForTimeout(1500);
      } else {
        console.log(`   ↳ Pass ${pass}: Clicked ${clickedInThisPass} expand button(s) (Total: ${totalClicked})`);
      }

      // Expand any long truncated comment texts in current view
      await expandLongCommentText(page);

    } catch (e) {
      console.warn(`   ⚠️ Warning in expansion pass ${pass}:`, e.message);
      break;
    }
  }

  // Final wait to ensure all pending GraphQL network requests finish
  await page.waitForTimeout(3000);
  console.log(`   ✅ Deep expansion completed! Total expand clicks: ${totalClicked}`);
}

/**
 * Main comment crawling function.
 */
async function runCommentsCrawler() {
  console.log("\n=======================================================");
  console.log("🚀 Starting Targeted Comments Crawler for Social Listening");
  console.log("=======================================================\n");

  if (!validateAuth()) return;

  const targetPosts = await getTargetPosts();
  if (targetPosts.length === 0) {
    console.log("ℹ️ No target posts found for comments crawling. Exiting.");
    return;
  }

  console.log(`📌 Processing ${targetPosts.length} post(s)...\n`);

  const crawledAt = new Date().toISOString();
  const allComments = [];

  const isHeaded =
    process.argv.includes("--headed") || process.argv.includes("--visible");

  if (isHeaded) {
    console.log("🖥️  Running in VISIBLE BROWSER mode (Headed). You can watch Chrome automate actions in real-time!\n");
  }

  const { browser, context } = await initBrowser({
    headless: !isHeaded,
    useAuth: true,
  });

  const page = await context.newPage();

  for (let i = 0; i < targetPosts.length; i++) {
    const post = targetPosts[i];
    console.log(`\n-------------------------------------------------------`);
    console.log(`[${i + 1}/${targetPosts.length}] Crawling post: ${post.post_link}`);
    console.log(`     Post ID: ${post.post_id}`);

    const postComments = [];

    // Setup GraphQL Response listener
    const responseHandler = async (response) => {
      const url = response.url();
      if (response.request().method() === "POST" && url.includes("/api/graphql/")) {
        try {
          const text = await response.text();
          const chunks = text.split("\n");
          for (const chunk of chunks) {
            if (!chunk.trim()) continue;
            const data = JSON.parse(chunk);
            extractCommentsFromGraphQL(
              data,
              postComments,
              post.post_id,
              crawledAt,
            );
          }
        } catch (e) {}
      }
    };

    page.on("response", responseHandler);

    try {
      await page.goto(post.post_link, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });

      await page.waitForTimeout(3000);

      // Select 'All Comments' filter
      await selectAllCommentsFilter(page);

      // Expand comments and replies
      await expandComments(page, 10);

      // Final wait for ongoing GraphQL requests
      await page.waitForTimeout(3000);

      // If GraphQL missed visible comments, use DOM fallback
      if (postComments.length === 0) {
        console.log("   ⚠️ GraphQL captured 0 comments, running DOM extraction fallback...");
        const domComments = await extractCommentsFromDOM(page, post.post_id, crawledAt);
        postComments.push(...domComments);
      }

      console.log(`   💬 Captured ${postComments.length} comment(s) for this post.`);
      allComments.push(...postComments);
    } catch (err) {
      console.error(`   ❌ Failed to crawl post ${post.post_link}:`, err.message);
    } finally {
      page.off("response", responseHandler);
    }
  }

  await browser.close();

  // Deduplicate captured comments by comment_id
  const seenIds = new Set();
  const uniqueComments = [];
  for (const c of allComments) {
    if (!seenIds.has(c.comment_id)) {
      seenIds.add(c.comment_id);
      uniqueComments.push(c);
    }
  }

  // Link nested reply hierarchy (author mentions & nested GraphQL links)
  const hierarchicalComments = linkCommentHierarchy(uniqueComments);

  console.log(`\n📊 Total Unique Comments Extracted: ${hierarchicalComments.length}`);
  const nestedCount = hierarchicalComments.filter((c) => c.parent_comment_id !== null).length;
  console.log(`   🌳 Nested Replies Detected & Linked: ${nestedCount}/${hierarchicalComments.length}`);

  // Save to output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = path.join(OUTPUT_DIR, `comments_${timestamp}.json`);

  fs.writeFileSync(outputPath, JSON.stringify(hierarchicalComments, null, 2), "utf-8");
  console.log(`💾 Saved comments data to: ${outputPath}`);
  console.log("✨ Comments crawler run finished successfully!\n");
}

runCommentsCrawler().catch((err) => {
  console.error("❌ Fatal error in crawler_comments:", err);
  process.exit(1);
});
