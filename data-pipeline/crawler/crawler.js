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

  // --- MẤU CHỐT: LẮNG NGHE GÓI TIN TỪ FACEBOOK SERVER ---
  page.on("response", async (response) => {
    const url = response.url();
    // Bắt các request gửi đến GraphQL của Facebook
    if (
      response.request().method() === "POST" &&
      url.includes("/api/graphql/")
    ) {
      try {
        const text = await response.text();
        // Facebook thường stream data, trả về nhiều dòng JSON riêng biệt trong 1 request
        const chunks = text.split("\n");

        for (const chunk of chunks) {
          if (!chunk.trim()) continue;
          const data = JSON.parse(chunk);
          // Gửi data vào hàm đệ quy để mò tìm các bài post
          extractPostFromGraphQL(data, capturedPosts);
        }
      } catch (e) {
        // Bỏ qua lỗi parse JSON vì có thể có payload mã hoá hoặc rỗng
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
  // Scroll nhiều hơn một chút để ép Facebook phải gọi API tải thêm bài viết
  for (let i = 0; i < 5; i++) {
    try {
      await page.keyboard.press("End");
      await new Promise((r) => setTimeout(r, 4000));
    } catch (e) {}
  }

  console.log("🔍 Filtering and deduplicating collected posts...");

  // Facebook có thể trả về 1 bài viết nhiều lần, ta cần lọc trùng lặp
  const uniquePosts = [];
  const seenLinks = new Set();
  const seenContents = new Set();

  for (const post of capturedPosts) {
    if (!post.content || post.content.length < 10) continue; // Bỏ qua bài quá ngắn

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

    // Preview post đầu tiên
    console.log("🔍 Sample post:", JSON.stringify(uniquePosts[0], null, 2));
  } else {
    console.log("⚠️ No valid posts found via API. Try scrolling more.");
  }

  await browser.close();
}

/**
 * Hàm đệ quy để mò tìm dữ liệu bài viết trong cục JSON khổng lồ của Facebook
 */
function extractPostFromGraphQL(node, postsArray) {
  // Nếu là Array, chui vào từng phần tử
  if (Array.isArray(node)) {
    node.forEach((n) => extractPostFromGraphQL(n, postsArray));
    return;
  }
  if (typeof node !== "object" || node === null) return;

  // Dấu hiệu nhận biết 1 Object là bài viết (Story) trên Facebook
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

        // 3. Lấy Link bài viết
        let postLink = node.url || "";
        if (!postLink) {
          postLink =
            node.comet_sections?.context_layout?.story?.comet_sections
              ?.metadata?.[0]?.story?.url || "";
        }
        if (postLink && postLink.includes("?")) {
          postLink = postLink.split("?")[0]; // Làm sạch Link
        }

        // 4. Lấy Ngày đăng (Unix Timestamp -> Chuyển thành ISO String)
        let postDate = "";
        const creationTime =
          node.creation_time ||
          node.comet_sections?.context_layout?.story?.comet_sections
            ?.metadata?.[0]?.story?.creation_time;
        if (creationTime) {
          postDate = new Date(creationTime * 1000).toISOString();
        }

        // 5. Lấy Thống kê (Likes, Comments)
        let reactions = 0;
        let comments = 0;
        const feedback =
          node.feedback ||
          node.comet_sections?.feedback?.story?.feedback_context
            ?.feedback_target_with_context;

        if (feedback) {
          reactions =
            feedback.reaction_count?.count ||
            feedback.ufi_metrics?.feedback_reactions?.count ||
            0;
          comments =
            feedback.comment_count?.count ||
            feedback.ufi_metrics?.feedback_comments_count ||
            feedback.comments_count ||
            0;
        }

        // Push vào mảng tạm thời
        postsArray.push({
          author,
          post_date: postDate,
          post_link: postLink,
          content,
          stats: {
            reactions: reactions.toString(),
            comments: comments.toString(),
          },
          crawled_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      // Bỏ qua nếu object JSON bị thiếu cấu trúc
    }
  }

  // Đệ quy tìm sâu vào các node con (vì Facebook thường bọc data trong rất nhiều lớp)
  Object.values(node).forEach((val) => extractPostFromGraphQL(val, postsArray));
}

if (process.argv[1] === __filename) {
  runCrawler().catch((err) => {
    console.error("❌ Error during crawling:", err);
    process.exit(1);
  });
}
