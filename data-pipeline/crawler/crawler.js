// crawler.js
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initBrowser } from "./utils/browser.js";
import { AUTH_FILE } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GROUP_URL = process.env.FACEBOOK_GROUP_URL;

/**
 * Main crawler function using GraphQL API Interception
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

  const page = await context.newPage();
  const capturedPosts = [];

  // Lắng nghe gói tin từ Facebook Server
  page.on("response", async (response) => {
    const url = response.url();
    if (
      response.request().method() === "POST" &&
      url.includes("/api/graphql/")
    ) {
      try {
        const text = await response.text();
        const chunks = text.split("\n");

        for (const chunk of chunks) {
          if (!chunk.trim()) continue;
          const data = JSON.parse(chunk);
          extractPostFromGraphQL(data, capturedPosts);
        }
      } catch (e) {
        // Bỏ qua lỗi parse JSON
      }
    }
  });

  console.log(`🚀 Accessing group: ${GROUP_URL}`);

  try {
    await page.goto(GROUP_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
  } catch (e) {
    console.log("⚠️ Page load timeout, continuing...");
  }

  console.log("⏳ Waiting for group to load and intercepting API calls...");
  try {
    await page.waitForSelector('div[role="feed"]', { timeout: 20000 });
  } catch (e) {
    console.log("⚠️ Feed selector not found, but we will scroll anyway.");
  }

  console.log("⬇️  Scrolling page to trigger API requests...");
  for (let i = 0; i < 5; i++) {
    try {
      await page.keyboard.press("End");
      await new Promise((r) => setTimeout(r, 4000));
    } catch (e) {}
  }

  console.log("🔍 Filtering and deduplicating collected posts...");

  const uniquePosts = [];
  const seenLinks = new Set();
  const seenContents = new Set();

  for (const post of capturedPosts) {
    if (!post.content || post.content.length < 10) continue;

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

  console.log(
    `✅ Successfully collected ${uniquePosts.length} posts via API Interception.`,
  );

  if (uniquePosts.length > 0) {
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const fileName = `posts_graphql_${Date.now()}.json`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(uniquePosts, null, 2));
    console.log(`💾 Data saved to: ${filePath}`);

    console.log("🔍 Sample post:", JSON.stringify(uniquePosts[0], null, 2));
  } else {
    console.log("⚠️ No valid posts found via API. Try scrolling more.");
  }

  await browser.close();
}

/**
 * THUẬT TOÁN VÉT CẠN: Quét toàn bộ object để tìm con số lớn nhất
 * liên quan đến comment và reaction. Không quan tâm FB giấu sâu cỡ nào.
 */
function extractStatsAggressively(node) {
  let maxComments = 0;
  let maxReactions = 0;

  function traverse(o) {
    if (o === null || typeof o !== "object") return;

    for (const [k, v] of Object.entries(o)) {
      const key = k.toLowerCase();

      // Bắt Comment
      if (key.includes("comment")) {
        if (typeof v === "number" && key.includes("count") && v > maxComments)
          maxComments = v;
        if (v && typeof v.count === "number" && v.count > maxComments)
          maxComments = v.count;
        if (
          v &&
          typeof v.total_count === "number" &&
          v.total_count > maxComments
        )
          maxComments = v.total_count;
      }

      // Bắt Reaction / Like
      if (key.includes("reaction") || key.includes("like")) {
        if (typeof v === "number" && key.includes("count") && v > maxReactions)
          maxReactions = v;
        if (v && typeof v.count === "number" && v.count > maxReactions)
          maxReactions = v.count;
        if (
          v &&
          typeof v.total_count === "number" &&
          v.total_count > maxReactions
        )
          maxReactions = v.total_count;
      }

      // Tiếp tục chui sâu xuống các tầng dưới
      if (typeof v === "object") traverse(v);
    }
  }

  traverse(node);
  return { reactions: maxReactions, comments: maxComments };
}

/**
 * Hàm đệ quy mò tìm dữ liệu bài viết
 */
function extractPostFromGraphQL(node, postsArray) {
  if (Array.isArray(node)) {
    node.forEach((n) => extractPostFromGraphQL(n, postsArray));
    return;
  }
  if (typeof node !== "object" || node === null) return;

  if (node.__typename === "Story" || (node.comet_sections && node.post_id)) {
    try {
      // 1. Lấy nội dung
      let content = "";
      if (node.message && node.message.text) {
        content = node.message.text;
      } else if (node.comet_sections?.content?.story?.message?.text) {
        content = node.comet_sections.content.story.message.text;
      }

      if (content) {
        // 2. Lấy Tác giả
        let author = "Unknown";
        const actors =
          node.actors ||
          node.comet_sections?.context_layout?.story?.comet_sections
            ?.actor_photo?.story?.actors;
        if (actors && actors.length > 0 && actors[0].name) {
          author = actors[0].name;
        }

        // 3. Lấy Link
        let postLink = node.url || "";
        if (!postLink) {
          postLink =
            node.comet_sections?.context_layout?.story?.comet_sections
              ?.metadata?.[0]?.story?.url || "";
        }
        if (postLink && postLink.includes("?")) {
          postLink = postLink.split("?")[0];
        }

        // 4. Lấy Ngày đăng
        let postDate = "";
        const creationTime =
          node.creation_time ||
          node.comet_sections?.context_layout?.story?.comet_sections
            ?.metadata?.[0]?.story?.creation_time;
        if (creationTime) {
          postDate = new Date(creationTime * 1000).toISOString();
        }

        // 5. LẤY STATS BẰNG THUẬT TOÁN VÉT CẠN TỐI THƯỢNG
        const stats = extractStatsAggressively(node);

        postsArray.push({
          author,
          post_date: postDate,
          post_link: postLink,
          content,
          stats: {
            reactions: stats.reactions.toString(),
            comments: stats.comments.toString(),
          },
          crawled_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      // Bỏ qua lỗi
    }
  }

  // Tiếp tục chui sâu xuống tìm các Story khác
  Object.values(node).forEach((val) => extractPostFromGraphQL(val, postsArray));
}

if (process.argv[1] === __filename) {
  runCrawler().catch((err) => {
    console.error("❌ Error during crawling:", err);
    process.exit(1);
  });
}
