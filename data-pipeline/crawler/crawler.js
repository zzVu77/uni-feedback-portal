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
      // Dùng setTimeout thay cho waitForTimeout (đã bị deprecated)
      await new Promise((r) => setTimeout(r, 3000));
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

        // --- BẮT ĐẦU LOGIC MỚI: TÌM LINK VÀ NGÀY ĐĂNG ---
        let postLink = "";
        let postDate = "";

        // 1. Lấy tất cả thẻ a trong bài viết
        const allLinks = Array.from(item.querySelectorAll("a"));

        // 2. Tìm thẻ a CHÍNH XÁC là ngày đăng bài viết
        // Điều kiện:
        // - href chứa "/posts/" hoặc "/permalink/"
        // - QUAN TRỌNG: KHÔNG chứa "comment_id" (để tránh lấy nhầm ngày của comment)
        // - QUAN TRỌNG: KHÔNG chứa "/user/" (để tránh lấy nhầm link tác giả)
        const dateAnchor = allLinks.find((a) => {
          const href = a.getAttribute("href");
          if (!href) return false;

          const isPostLink =
            href.includes("/posts/") || href.includes("/permalink/");
          const isNotComment =
            !href.includes("comment_id") && !href.includes("reply_comment_id");
          const isNotUser = !href.includes("/user/");

          return isPostLink && isNotComment && isNotUser;
        });

        if (dateAnchor) {
          // Xử lý Link: Cắt bỏ các tham số rác sau dấu ?
          try {
            const urlObj = new URL(dateAnchor.href);
            postLink = urlObj.origin + urlObj.pathname;
          } catch (e) {
            postLink = dateAnchor.href;
          }

          // Xử lý Ngày đăng:
          // Ưu tiên 1: Lấy aria-label (Thường chứa: "Thứ Hai, 17 tháng 2...")
          // Ưu tiên 2: Lấy innerText (Thường chứa: "2 giờ", "Vừa xong")
          // Đôi khi aria-label nằm ở thẻ span con bên trong thẻ a
          const ariaLabel =
            dateAnchor.getAttribute("aria-label") ||
            dateAnchor.querySelector("span")?.getAttribute("aria-label");

          if (ariaLabel) {
            postDate = ariaLabel;
          } else {
            postDate = dateAnchor.innerText;
          }
        }
        // ----------------------------------------------------

        // 1. Split text into lines
        let lines = rawText
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 1)
          .filter((l) => l !== "Facebook");

        if (lines.length < 2) return;

        // 2. Extract author (usually the first line)
        // Logic phụ: Bỏ qua dòng tên Group nếu nó xuất hiện đầu tiên (VD: UTE - ...)
        if (lines[0].startsWith("UTE -") || lines[0].includes("Nhóm")) {
          lines.shift();
        }
        const author = lines[0];

        // 3. Find cut-off point for main content
        let endIndex = lines.length;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];

          // Regex for stats or common stopping keywords
          if (
            /^\d+([.,]\d+)?([KkMm])?$/.test(line) ||
            /^\d+.*(bình luận|lượt chia sẻ|lượt thích)/.test(line) || // Thêm "lượt thích"
            line === "Thích" ||
            line === "Bình luận" ||
            line === "Chia sẻ" // Thêm nút hành động
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
            line !== postDate && // Lọc bỏ dòng ngày tháng nếu trùng
            !line.startsWith("UTE - "),
        );

        const cleanContent = contentLines.join("\n");

        if (cleanContent.length < 5) return;

        // 6. Extract reactions and comments count
        let reactions = "0";
        let comments = "0";

        // Cập nhật Regex để bắt tốt hơn
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
          post_date: postDate, // Dữ liệu mới
          post_link: postLink, // Dữ liệu mới
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
