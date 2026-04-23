import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initBrowser } from "./utils/browser.js";
import { AUTH_FILE } from "./constants.js";
import { extractPostsRecursively } from "./utils/extractor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GROUP_URL = process.env.FACEBOOK_GROUP_URL;
const OUTPUT_DIR = path.join(__dirname, "output");

/**
 * Validates the environment and necessary files before starting the crawler.
 * @returns {boolean} True if all checks pass, false otherwise.
 */
function validateConfig() {
  if (!fs.existsSync(AUTH_FILE)) {
    console.error(
      `❌ ${AUTH_FILE} not found. Please run 'node auth.js' first!`,
    );
    return false;
  }

  if (!GROUP_URL) {
    console.error("❌ FACEBOOK_GROUP_URL not found in .env file.");
    return false;
  }

  return true;
}

/**
 * Sets up the GraphQL response interception on the page.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Array} capturedPosts - The shared array to store captured posts.
 * @param {string} crawledAt - The crawl timestamp.
 */
function setupGraphQLInterception(page, capturedPosts, crawledAt) {
  page.on("response", async (response) => {
    const url = response.url();
    const isGraphQLPost =
      response.request().method() === "POST" && url.includes("/api/graphql/");

    if (isGraphQLPost) {
      try {
        const text = await response.text();
        const chunks = text.split("\n");

        for (const chunk of chunks) {
          if (!chunk.trim()) continue;
          const data = JSON.parse(chunk);
          extractPostsRecursively(data, capturedPosts, crawledAt);
        }
      } catch (e) {
        // Ignore JSON parsing or empty response errors
      }
    }
  });
}

/**
 * Scrolls the page to trigger dynamic content loading.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {number} iterations - Number of scroll iterations.
 */
async function scrollFeed(page, iterations = 5) {
  console.log(
    `⬇️ Scrolling page ${iterations} times to trigger API requests...`,
  );
  for (let i = 0; i < iterations; i++) {
    try {
      await page.keyboard.press("End");
      await new Promise((resolve) => setTimeout(resolve, 4000));
    } catch (e) {
      console.warn("⚠️ Scroll iteration failed:", e.message);
    }
  }
}

/**
 * Filters and deduplicates the collected posts.
 * @param {Array} posts - The raw list of collected posts.
 * @returns {Array} - A deduplicated list of unique posts.
 */
function filterUniquePosts(posts) {
  const uniquePosts = [];
  const seenLinks = new Set();
  const seenContents = new Set();

  for (const post of posts) {
    if (!post.content || post.content.trim().length < 10) continue;

    const linkKey = post.post_link || post.content.substring(0, 50);

    if (!seenLinks.has(linkKey) && !seenContents.has(post.content)) {
      seenLinks.add(linkKey);
      seenContents.add(post.content);
      uniquePosts.push({
        id: uniquePosts.length,
        ...post,
      });
    }
  }

  return uniquePosts;
}

/**
 * Saves the extracted posts to a JSON file.
 * @param {Array} posts - The list of unique posts to save.
 * @returns {string|null} - The path to the saved file or null if nothing was saved.
 */
function savePosts(posts) {
  if (posts.length === 0) {
    console.log("⚠️ No valid posts found to save.");
    return null;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const fileName = `posts_graphql_${Date.now()}.json`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
  console.log(`✅ Successfully collected ${posts.length} unique posts.`);
  console.log(`💾 Data saved to: ${filePath}`);

  if (posts[0]) {
    console.log("🔍 Sample post summary:", {
      author: posts[0].author,
      contentPrefix: posts[0].content.substring(0, 50) + "...",
    });
  }

  return filePath;
}

/**
 * Main entry point for the Facebook group crawler.
 */
async function runCrawler() {
  if (!validateConfig()) return;

  const { browser, context } = await initBrowser({
    headless: false, //TODO: Change to true for production
    useAuth: true,
  });

  try {
    const page = await context.newPage();
    const capturedPosts = [];
    const crawledAt = new Date().toISOString();

    setupGraphQLInterception(page, capturedPosts, crawledAt);

    console.log(`🚀 Navigating to group: ${GROUP_URL}`);
    try {
      await page.goto(GROUP_URL, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    } catch (e) {
      console.warn("⚠️ Initial page load timeout, attempting to continue...");
    }

    console.log("⏳ Waiting for feed to initialize...");
    try {
      await page.waitForSelector('div[role="feed"]', { timeout: 20000 });
    } catch (e) {
      console.warn(
        "⚠️ Feed selector not found, continuing with scroll strategy...",
      );
    }

    await scrollFeed(page);

    console.log("🔍 Filtering and deduplicating collected data...");
    const uniquePosts = filterUniquePosts(capturedPosts);
    savePosts(uniquePosts);
  } catch (err) {
    console.error("❌ Fatal error during crawling:", err);
  } finally {
    console.log("🏁 Closing browser...");
    await browser.close();
  }
}

// Execute the crawler if run directly
if (process.argv[1] === __filename) {
  runCrawler().catch((err) => {
    console.error("❌ CLI Execution Error:", err);
    process.exit(1);
  });
}
