// crawler.js
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initBrowser } from "./utils/browser.js";
import { BADGES, STOP_KEYWORDS, AUTH_FILE } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GROUP_URL = process.env.FACEBOOK_GROUP_URL;

/**
 * Main crawler function.
 */
async function runCrawler() {
  if (!fs.existsSync(AUTH_FILE)) {
    console.error(
      `❌ ${AUTH_FILE} not found. Please run 'node auth.js' first!`,
    );
    return;
  }

  if (!GROUP_URL) {
    console.error("❌ FACEBOOK_GROUP_URL not found in .env file.");
    return;
  }

  const { browser, context } = await initBrowser({
    headless: false,
    useAuth: true,
  });
  // todo: turn on headless when deploy to production
  const page = await context.newPage();

  console.log(`🚀 Accessing group: ${GROUP_URL}`);

  try {
    await page.goto(GROUP_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
  } catch (e) {
    console.log("⚠️ Page load timeout, continuing...");
  }

  try {
    console.log("⏳ Waiting for group content...");
    await page.waitForSelector('div[role="feed"]', { timeout: 20000 });
  } catch (error) {
    console.error("❌ Error: Group content not found.");
    await browser.close();
    return;
  }

  console.log("⬇️  Scrolling page...");
  for (let i = 0; i < 3; i++) {
    try {
      await page.keyboard.press("End");
      await page.waitForTimeout(3000);
    } catch (e) {
      // Ignore scroll errors
    }
  }

  console.log("🔍 Extracting and cleaning posts...");
  const posts = await page.evaluate(
    ({ badges, stopWords }) => {
      const data = [];
      const feed = document.querySelector('div[role="feed"]');
      if (!feed) return [];

      const items = Array.from(feed.children);

      items.forEach((item, index) => {
        const rawText = item.innerText;
        if (!rawText || rawText.length < 30) return;

        // 1. Split text into lines
        let lines = rawText
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 1)
          .filter((l) => l !== "Facebook");

        if (lines.length < 2) return;

        // 2. Extract author (usually the first line)
        const author = lines[0];

        // 3. Find cut-off point for main content
        let endIndex = lines.length;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];

          // Regex for stats or common stopping keywords
          if (
            /^\d+([.,]\d+)?([KkMm])?$/.test(line) ||
            /^\d+.*(bình luận|lượt chia sẻ)/.test(line)
          ) {
            endIndex = i;
            break;
          }

          if (stopWords.some((sw) => line.includes(sw))) {
            endIndex = i;
            break;
          }
        }

        // 4. Extract content body
        let contentLines = lines.slice(1, endIndex);

        // 5. Filter out badges and redundant group name
        contentLines = contentLines.filter(
          (line) =>
            !badges.includes(line) &&
            line !== author &&
            !line.startsWith("UTE - "),
        );

        const cleanContent = contentLines.join("\n");

        if (cleanContent.length < 5) return;

        // 6. Extract reactions and comments count
        let reactions = "0";
        let comments = "0";

        const reactMatch =
          rawText.match(/Tất cả cảm xúc:[\s\n]*(\d+[.,\dKkMm]*)/) ||
          rawText.match(/và[\s\n]*(\d+[.,\dKkMm]*)[\s\n]*người khác/);

        if (reactMatch) reactions = reactMatch[1];
        else if (rawText.includes("Tất cả cảm xúc")) reactions = "Few";

        const commentMatch = rawText.match(/(\d+[.,\dKkMm]*)[\s\n]*bình luận/i);
        if (commentMatch) comments = commentMatch[1];

        data.push({
          id: index,
          author,
          content: cleanContent,
          stats: { reactions, comments },
          crawled_at: new Date().toISOString(),
        });
      });

      return data;
    },
    { badges: BADGES, stopWords: STOP_KEYWORDS },
  );

  console.log(`✅ Successfully collected ${posts.length} cleaned posts.`);

  if (posts.length > 0) {
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const fileName = `posts_${Date.now()}.json`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
    console.log(`💾 Data saved to: ${filePath}`);

    // Preview first post
    console.log("🔍 Sample post:", JSON.stringify(posts[0], null, 2));
  } else {
    console.log("⚠️ No valid posts found.");
  }

  await browser.close();
}

if (process.argv[1] === __filename) {
  runCrawler().catch((err) => {
    console.error("❌ Error during crawling:", err);
    process.exit(1);
  });
}
