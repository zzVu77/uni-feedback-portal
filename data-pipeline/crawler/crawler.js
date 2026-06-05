import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initBrowser } from "./utils/browser.js";
import { AUTH_FILE, GROUP_URLS } from "./constants.js";
import { extractPostsRecursively } from "./utils/extractor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "output");

/**
 * Validates the environment and necessary files before starting the crawler.
 */
function validateConfig(urls) {
  if (!fs.existsSync(AUTH_FILE)) {
    console.error(
      `❌ ${AUTH_FILE} not found. Please run 'node auth.js' first!`,
    );
    return false;
  }

  if (urls.length === 0) {
    console.error("❌ No URLs provided via command line or constants.js.");
    return false;
  }

  return true;
}

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
      } catch (e) { }
    }
  });
}

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

function savePosts(posts) {
  if (posts.length === 0) {
    console.log(`⚠️ No valid posts found to save.`);
    return null;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const fileName = `posts_all_groups_${Date.now()}.json`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
  console.log(
    `✅ Successfully collected ${posts.length} unique posts across ALL groups.`,
  );
  console.log(`💾 Data saved to: ${filePath}`);

  return filePath;
}

/**
 * Main entry point for the Facebook group crawler.
 */
async function runCrawler() {
  const args = process.argv.slice(2);
  const targetUrls = args.length > 0 ? args : GROUP_URLS;

  if (!validateConfig(targetUrls)) return;

  const { browser, context } = await initBrowser({
    headless: true, // TODO: Change to true for production
    useAuth: true,
  });

  try {
    console.log(`📋 Found ${targetUrls.length} groups to crawl.`);

    const allCapturedPosts = [];

    for (let i = 0; i < targetUrls.length; i++) {
      const groupUrl = targetUrls[i];
      console.log(`\n======================================================`);
      console.log(
        `🚀 [${i + 1}/${targetUrls.length}] Processing Group: ${groupUrl}`,
      );
      console.log(`======================================================`);

      const page = await context.newPage();
      const crawledAt = new Date().toISOString();

      setupGraphQLInterception(page, allCapturedPosts, crawledAt);

      try {
        await page.goto(groupUrl, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        console.log("⏳ Waiting for feed to initialize...");
        try {
          await page.waitForSelector('div[role="feed"]', { timeout: 20000 });
        } catch (e) {
          console.warn(
            "⚠️ Feed selector not found, continuing with scroll strategy...",
          );
        }

        await scrollFeed(page);

        console.log(
          `✅ Group ${i + 1} finished. Current total posts collected in memory: ${allCapturedPosts.length}`,
        );
      } catch (err) {
        console.error(`❌ Error while crawling group ${groupUrl}:`, err);
      } finally {
        console.log(`🏁 Closing tab for group ${i + 1}...`);
        await page.close();
      }

      if (i < targetUrls.length - 1) {
        console.log(
          `⏸️ Waiting 10 seconds before navigating to the next group...`,
        );
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }

    console.log(`\n======================================================`);
    console.log(
      "🔍 Filtering and deduplicating collected data from ALL groups...",
    );
    const uniquePosts = filterUniquePosts(allCapturedPosts);
    savePosts(uniquePosts);
  } catch (err) {
    console.error("❌ Fatal error during crawling process:", err);
  } finally {
    console.log("\n🏁 All tasks finished. Closing browser...");
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
