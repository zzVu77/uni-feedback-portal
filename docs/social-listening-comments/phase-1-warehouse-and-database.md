# PHASE 1: CẤU TRÚC DỮ LIỆU & DATA WAREHOUSE (BIGQUERY, DBT, PRISMA)

> **Mục tiêu**: Xây dựng nền tảng lưu trữ chuẩn hóa cho bình luận (comments) trên cả 2 hệ thống: **Google BigQuery** (phục vụ biến đổi, phân tích lịch sử, nạp dữ liệu AI) và **PostgreSQL** (phục vụ Backend API truy vấn thời gian thực với độ trễ thấp).

---

## 1. Yêu Cầu Kỹ Thuật Chi Tiết

### 1.1. BigQuery Raw Table (`social_raw.comments`)
Tạo bảng chứa bình luận thô từ crawler:
- Tên dataset: `social_raw`
- Tên bảng: `comments`
- Phân vùng (Partitioning): Theo `DATE(crawled_at)` để tối ưu hóa chi phí truy vấn và truy xuất incremental.
- Phân cụm (Clustering): Theo `post_id` để tăng tốc độ truy vấn gom nhóm theo bài viết.
- **Cấu trúc trường**:
  | Tên Cột | Kiểu Dữ Liệu | Chế Độ | Diễn Giải |
  | :--- | :--- | :--- | :--- |
  | `comment_id` | `STRING` | REQUIRED | ID định danh bình luận từ Facebook |
  | `post_id` | `STRING` | REQUIRED | ID bài viết chứa bình luận |
  | `parent_comment_id` | `STRING` | NULLABLE | ID bình luận cha (nếu là câu trả lời/reply) |
  | `author` | `STRING` | NULLABLE | Tên người bình luận (hoặc chuỗi ẩn danh) |
  | `content` | `STRING` | REQUIRED | Nội dung văn bản bình luận |
  | `reaction_count` | `INT64` | NULLABLE | Lượt thích/thả cảm xúc trên bình luận |
  | `commented_at` | `TIMESTAMP` | NULLABLE | Thời điểm bình luận được đăng |
  | `crawled_at` | `TIMESTAMP` | REQUIRED | Thời điểm crawler thu thập bản ghi này |

---

### 1.2. dbt Transformation Models
Thư mục: `data-pipeline/dbt_transformation/models/`

#### A. Model Staging: `models/staging/stg_fb_comments.sql`
- **Nhiệm vụ**:
  - Loại bỏ các comment rác: nội dung rỗng (`content IS NULL` hoặc `TRIM(content) = ''`), comment chỉ chứa tag tên bạn bè hoặc sticker trống.
  - Khử trùng lặp (Deduplicate) theo `comment_id`, giữ lại bản ghi có `crawled_at` mới nhất bằng `ROW_NUMBER() OVER (PARTITION BY comment_id ORDER BY crawled_at DESC)`.
  - Ép kiểu dữ liệu chuẩn (Cast `commented_at`, `crawled_at` sang TIMESTAMP).

#### B. Model Schema Test: `models/staging/stg_fb_comments.yml`
- Test `unique` và `not_null` cho `comment_id`.
- Test `not_null` cho `post_id` và `content`.

#### C. Model Marts Mới: `models/marts/mrt_post_comments_detail.sql`
- Kết hợp dữ liệu bình luận từ `stg_fb_comments` với kết quả phân tích AI từ `stg_ai_comment_analysis` (sẽ được sinh ở Phase 3).
- Cung cấp dữ liệu đã làm giàu cho Reverse ETL sang PostgreSQL.

#### D. Cập nhật Model Marts Hiện Có: `models/marts/mrt_trending_issues_dashboard.sql`
- Thêm các cột tổng hợp dư luận:
  - `is_comments_crawled`: `BOOLEAN` (đánh dấu đã quét bình luận bài này chưa).
  - `comments_ai_summary`: `STRING` (tóm tắt ý kiến sinh viên từ comment).
  - `negative_comments_ratio`: `FLOAT64` (tỉ lệ bình luận tiêu cực / tổng số bình luận).
  - `urgency_level`: `STRING` (`NORMAL`, `WARNING`, `CRITICAL`).

---

### 1.3. PostgreSQL Schema (`backend/prisma/schema.prisma`)
Cập nhật Prisma schema tại `backend/prisma/schema.prisma`:

#### A. Tạo Model mới `DashboardPostComments`:
```prisma
model DashboardPostComments {
  id              String                   @id @default(uuid()) @db.Uuid
  commentId       String                   @unique @map("comment_id")
  postId          String                   @map("post_id")
  parentCommentId String?                  @map("parent_comment_id")
  author          String
  content         String                   @db.Text
  reactionCount   Int                      @default(0) @map("reaction_count")
  commentedAt     DateTime                 @map("commented_at")
  sentimentLabel  String                   @map("sentiment_label")
  sentimentScore  Float                    @map("sentiment_score")
  isTopConcern    Boolean                  @default(false) @map("is_top_concern")
  crawledAt       DateTime                 @default(now()) @map("crawled_at")

  post            DashboardTrendingIssues  @relation(fields: [postId], references: [postId], onDelete: Cascade)

  @@index([postId])
  @@index([sentimentLabel])
  @@map("dashboard_post_comments")
}
```

#### B. Cập nhật Model `DashboardTrendingIssues`:
- Bổ sung các quan hệ và trường:
```prisma
  isCommentsCrawled       Boolean                 @default(false) @map("is_comments_crawled")
  commentsAiSummary       String?                 @map("comments_ai_summary") @db.Text
  negativeCommentsRatio   Float?                  @map("negative_comments_ratio")
  urgencyLevel            String?                 @default("NORMAL") @map("urgency_level")
  comments                DashboardPostComments[]
```

---

## 2. Tiêu Chí Đánh Giá Nghiệm Thu (Acceptance Criteria)

1. **BigQuery**: Bảng `social_raw.comments` được khởi tạo thành công với cấu trúc chính xác, có `PARTITION BY DATE(crawled_at)` và `CLUSTER BY post_id`.
2. **dbt Staging**: Chạy lệnh `dbt run --select stg_fb_comments` thành công không phát sinh cảnh báo lỗi; `dbt test --select stg_fb_comments` pass 100%.
3. **dbt Marts**: Cập nhật `mrt_trending_issues_dashboard.sql` biên dịch (compile) thành công và không phá vỡ logic incremental hiện tại.
4. **Prisma Schema**: Chạy lệnh `npx prisma validate --schema=backend/prisma/schema.prisma` trả về kết quả hợp lệ (`The schema is valid`).
5. **Database Migration**: Chạy lệnh `npx prisma migrate dev` (hoặc `db push` / `migration:deploy`) tạo bảng thành công trên PostgreSQL mà không làm mất hoặc sai lệch dữ liệu bảng `dashboard_trending_issues` hiện có.

---

## 3. Checklist Rà Soát (Audit Checklist)

- [x] **1.1. BigQuery DDL**: Tạo file script `data-pipeline/dbt_transformation/scripts/create_bigquery_comments_table.sql` (bảng `social_raw.comments`, `ai_raw.comment_analysis`, `ai_raw.post_comments_summary`).
- [x] **1.2. dbt Staging**: Tạo file `models/staging/stg_fb_comments.sql` (lọc rác, deduplicate theo `comment_id`, chuẩn hóa kiểu).
- [x] **1.3. dbt Test Schema**: Tạo file `models/staging/stg_fb_comments.yml` định nghĩa tests (`unique`, `not_null`).
- [x] **1.4. dbt Marts**: Cập nhật `models/marts/mrt_trending_issues_dashboard.sql` và `.yml` thêm 4 cột mới (`is_comments_crawled`, `comments_ai_summary`, `negative_comments_ratio`, `urgency_level`).
- [x] **1.5. dbt Marts**: Tạo file `models/marts/mrt_post_comments_detail.sql` và `.yml` kết nối comments với AI sentiment.
- [x] **1.6. Prisma Schema**: Thêm model `DashboardPostComments` vào file `schema.prisma`.
- [x] **1.7. Prisma Schema**: Thêm relation `comments` và 4 trường mới vào model `DashboardTrendingIssues`.
- [x] **1.8. Migration**: Tạo file migration SQL `backend/prisma/migrations/add_dashboard_post_comments.sql` và generate Prisma Client (`v6.19.0`) thành công.
- [x] **1.9. Verify**: Prisma Client và schema validation pass 100%, sẵn sàng cho Phase 2.
