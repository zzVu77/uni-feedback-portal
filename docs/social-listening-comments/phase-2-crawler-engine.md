# PHASE 2: BỘ THU THẬP BÌNH LUẬN MỤC TIÊU (TARGETED CRAWLER & LOADER)

> **Mục tiêu**: Xây dựng module crawler chuyên biệt bằng **Playwright** truy cập trực tiếp vào các bài viết có nguy cơ cao, tự động mở rộng và trích xuất toàn bộ bình luận (kèm phản hồi), sau đó nạp dữ liệu thô vào Google BigQuery.

---

## 1. Yêu Cầu Kỹ Thuật Chi Tiết

### 1.1. Module Nhận Diện & Lọc Bài Viết Nguy Cơ Cao
Thư mục: `data-pipeline/crawler/`
- Tệp tin mới: `crawler_comments.js` (hoặc mở rộng `crawler.js`).
- Logic truy vấn danh sách bài viết cần quét bình luận:
  - **Chế độ Tự động (Batch Run)**: Lấy các bài viết từ BigQuery `uni_feedback_data_marts.mrt_trending_issues_dashboard` thỏa mãn:
    - `sentiment_label IN ('Tiêu cực', 'Stress lo âu')` HOẶC `sentiment_score <= -0.5`.
    - `is_comments_crawled = FALSE` (chưa từng cào) HOẶC bài đăng trong vòng 48 giờ qua và có `comment_count > 0`.
    - Giới hạn tối đa 10 - 20 bài viết / lần chạy để tránh bị Facebook hạn chế.
  - **Chế độ Thủ công (On-Demand Run)**: Nhận trực tiếp danh sách `[post_url_1, post_url_2]` từ tham số dòng lệnh CLI (`node crawler_comments.js --urls ...`).

---

### 1.2. Kỹ Thuật Tương Tác & Trích Xuất Dữ Liệu Bình Luận (Playwright)

#### A. Khởi tạo & Điều hướng:
- Sử dụng session lưu trong file `auth.json` (tương tự crawler bài viết hiện tại).
- Mở URL bài viết với timeout an toàn (30s) và chờ `networkidle`.

#### B. Chuyển đổi Bộ Lọc Bình Luận:
- Facebook mặc định chỉ hiển thị *"Bình luận phù hợp nhất"* (Most relevant).
- Script phải tìm và click nút dropdown chuyển sang *"Tất cả bình luận"* (All comments):
  ```javascript
  const filterBtn = page.locator('div[role="button"]:has-text("Phù hợp nhất"), div[role="button"]:has-text("Most relevant")');
  if (await filterBtn.count() > 0) {
    await filterBtn.first().click();
    const allCommentsOption = page.locator('div[role="menuitem"]:has-text("Tất cả bình luận"), div[role="menuitem"]:has-text("All comments")');
    await allCommentsOption.first().click();
    await page.waitForTimeout(2000);
  }
  ```

#### C. Cuộn & Mở Rộng Bình Luận (Expand Comments & Replies):
- Lặp click các nút *"Xem thêm bình luận"* (`View more comments`) tối đa $N$ lần (ví dụ $N = 15$ để tránh vòng lặp vô hạn nếu bài có hàng ngàn comment).
- Lặp click các nút *"Xem thêm phản hồi"* (`View replies`).
- Tạm dừng (delay) ngẫu nhiên giữa các lần click từ 1.5s - 3s để giả lập hành vi người dùng thật.

#### D. Trích Xuất Dữ Liệu Bình Luận:
- **Phương án 1 (GraphQL Interception - Ưu tiên)**:
  - Bắt các response chứa GraphQL Query của comments.
  - Trích xuất: `comment_id`, `post_id`, `parent_comment_id`, `author_name`, `content`, `reaction_count`, `created_time`.
- **Phương án 2 (DOM Parsing - Fallback)**:
  - Quét các phần tử `div[role="article"]` nằm trong vùng bình luận.
  - Trích xuất text nội dung, tên tác giả và số react.

---

### 1.3. Định Dạng Lưu Trữ Tạm Thời (Output File)
Lưu vào thư mục `data-pipeline/crawler/output/`:
- Tên file: `comments_<timestamp>.json`
- Cấu trúc:
  ```json
  [
    {
      "comment_id": "123456789_987654321",
      "post_id": "123456789",
      "parent_comment_id": null,
      "author": "Nguyễn Văn A",
      "content": "Phòng đào tạo không thông báo gì từ sáng, sv ngồi chờ 3 tiếng rồi...",
      "reaction_count": 42,
      "commented_at": "2026-11-08T08:15:00.000Z",
      "crawled_at": "2026-11-08T08:30:00.000Z"
    }
  ]
  ```

---

### 1.4. Module Nạp Dữ Liệu vào BigQuery (`loader_comments.js`)
- Đọc file `comments_*.json` mới nhất trong thư mục `output/`.
- Kiểm tra tính hợp lệ của mảng bản ghi.
- Thực hiện nạp vào bảng `social_raw.comments` trên BigQuery bằng Google Cloud BigQuery SDK (`table.insert(rows)` hoặc load job file).
- Ghi log số lượng bản ghi đã nạp thành công.

---

## 2. Tiêu Chí Đánh Giá Nghiệm Thu (Acceptance Criteria)

1. **Khả năng tương tác Facebook UI**: Script Playwright tự động click chuyển sang chế độ *"Tất cả bình luận"* thành công mà không bị crash hoặc timeout.
2. **Thu thập đầy đủ cấu trúc**: Bắt được cả bình luận cấp 1 (`parent_comment_id: null`) và câu trả lời phản hồi (`parent_comment_id: parent_id`).
3. **Xử lý ngoại lệ (Fault Tolerance)**:
   - Nếu bài viết bị xóa hoặc bị khóa bình luận: Script ghi log cảnh báo và tiếp tục xử lý bài viết tiếp theo, không làm dừng tiến trình chung.
4. **Chuẩn hóa đầu ra**: File JSON xuất ra có đầy đủ các trường bắt buộc, không bị `undefined` ở các trường `comment_id`, `post_id`, `content`.
5. **Nạp BigQuery trơn tru**: Dữ liệu từ file JSON được nạp vào bảng `social_raw.comments` trên BigQuery, đếm số lượng dòng khớp 100% với file JSON.

---

## 3. Checklist Rà Soát (Audit Checklist)

- [x] **2.1. Script Crawler**: Tạo file `data-pipeline/crawler/crawler_comments.js` tương thích Playwright headless mode.
- [x] **2.2. Query Bài Viết Mục Tiêu**: Viết hàm `getTargetPosts` hỗ trợ CLI `--urls`, BigQuery query bài tiêu cực và fallback output posts gần nhất.
- [x] **2.3. Filter Click Logic**: Viết hàm `selectAllCommentsFilter` tự động click chuyển sang "Tất cả bình luận".
- [x] **2.4. Scroll & Expand**: Viết hàm `expandComments` click "Xem thêm bình luận" và "Xem phản hồi" có timeout và delay giả lập người dùng.
- [x] **2.5. GraphQL Extractor**: Viết hàm `extractCommentsFromGraphQL` trích xuất chuẩn cấu trúc comment từ response GraphQL.
- [x] **2.6. DOM Fallback**: Viết hàm `extractCommentsFromDOM` dự phòng trích xuất từ phần tử `div[role="article"]`.
- [x] **2.7. JSON Exporter**: Xuất file `output/comments_<timestamp>.json` chuẩn định dạng mảng object.
- [x] **2.8. Loader Script**: Tạo file `data-pipeline/crawler/loader_comments.js` nạp streaming insert vào BigQuery `social_raw.comments`.
- [x] **2.9. Unit Test & Syntax Check**: Kiểm tra cú pháp ESM và unit test trích xuất comment thành công 100%.
