# PHASE 3: XỬ LÝ TRÍ TUỆ NHÂN TẠO & REVERSE ETL (GEMINI AI & DLT)

> **Mục tiêu**: Sử dụng **Google Gemini AI** để phân tích cảm xúc từng bình luận, tổng hợp luồng ý kiến đám đông (Comments Synthesis), sau đó sử dụng **dlt (data load tool)** để đẩy dữ liệu phân tích từ BigQuery sang PostgreSQL.

---

## 1. Yêu Cầu Kỹ Thuật Chi Tiết

### 1.1. AI Comment Sentiment & Synthesis (`ai_processor_comments.py`)
Thư mục: `data-pipeline/ai_processing/`

#### A. Nhiệm vụ 1: Phân tích Cảm xúc từng Comment (Batch Sentiment Analysis)
- Đọc các comments chưa được phân loại từ BigQuery (`stg_fb_comments`).
- Gom nhóm theo batch (15 - 20 comments/batch) để gọi Gemini 2.5 Flash, tiết kiệm quota API.
- Prompt yêu cầu trả về cấu trúc JSON:
  ```json
  [
    {
      "comment_id": "string",
      "sentiment_label": "Tiêu cực | Tích cực | Trung lập | Bức xúc",
      "sentiment_score": -1.0 đến 1.0,
      "is_top_concern": true/false (đánh dấu nếu comment nêu bằng chứng, tố cáo vi phạm cụ thể hoặc có ảnh hưởng lớn)
    }
  ]
  ```
- Lưu kết quả vào bảng BigQuery `ai_raw.comment_analysis`.

#### B. Nhiệm vụ 2: Tổng Hợp Dư Luận (Comments Synthesis per Post)
- Đối với mỗi bài viết nguy cơ cao có bình luận:
  - Gom toàn bộ nội dung bình luận của bài viết đó lại.
  - Gửi đến Gemini kèm prompt chuyên gia Social Listening để tóm tắt:
    - **Luồng ý kiến chính**: Sinh viên đa số đồng tình hay phản bác? Cảm xúc chung là gì?
    - **Bằng chứng cụ thể trích xuất được**: Các phòng học, tòa nhà, thời gian, tên cán bộ/giảng viên, hoặc mã lỗi phần mềm được nhắc đến trong comment.
    - **Mức độ khẩn cấp (Urgency Level)**: `NORMAL`, `WARNING`, `CRITICAL` (ví dụ: kêu gọi biểu tình, đăng đơn tập thể, tẩy chay là `CRITICAL`).
  - Lưu tóm tắt này vào bảng BigQuery `ai_raw.post_comments_summary`.

---

### 1.2. dbt Models Kết Nối Tầng AI
1. **`models/staging/stg_ai_comment_analysis.sql`**: Staging bảng kết quả AI phân tích comments.
2. **`models/marts/mrt_post_comments_detail.sql`**:
   - `JOIN` giữa `stg_fb_comments` và `stg_ai_comment_analysis`.
   - Chuẩn bị đầy đủ các cột tương ứng với model Prisma `DashboardPostComments`.
3. **Cập nhật `models/marts/mrt_trending_issues_dashboard.sql`**:
   - Tính toán `negative_comments_ratio = COUNT(CASE WHEN sentiment_label IN ('Tiêu cực', 'Bức xúc') THEN 1 END) / COUNT(comment_id)`.
   - Kết hợp `comments_ai_summary` và `urgency_level` vào bản ghi bài viết.

---

### 1.3. Cập nhật Reverse ETL Pipeline (`services/reverse_etl.py`)
- Cấu hình SQLAlchemy `engine` với `pool_pre_ping=True` (đã bổ sung trước đó).
- Mở rộng script Reverse ETL để đồng bộ **cả 2 bảng** theo cơ chế Delta/Incremental:
  1. **Đồng bộ bảng `dashboard_trending_issues`**:
     - Cập nhật các trường mới: `is_comments_crawled`, `comments_ai_summary`, `negative_comments_ratio`, `urgency_level` bằng dlt `write_disposition='merge'`, `primary_key='post_id'`.
  2. **Đồng bộ bảng `dashboard_post_comments`**:
     - Lấy các comments mới từ `mrt_post_comments_detail` (dựa trên watermark `crawled_at > MAX(crawled_at)` trong PostgreSQL).
     - Đẩy vào PostgreSQL với `write_disposition='merge'`, `primary_key='comment_id'`.

---

### 1.4. Điều Phối Prefect Flow (`prefect-flow/run_pipeline.py`)
Cập nhật flow Prefect để tích hợp các task mới theo đúng trình tự:
```
1. Crawl Posts ➔ 2. Load Raw Posts ➔ 3. dbt Staging Posts ➔ 
4. AI Post Sentiment ➔ 
5. Targeted Crawl Comments (bài tiêu cực) ➔ 6. Load Raw Comments ➔ 
7. dbt Staging Comments ➔ 8. AI Comments Analysis & Synthesis ➔ 
9. dbt Final Dashboard & Comments Marts ➔ 
10. Reverse ETL (Posts + Comments sang Postgres)
```

---

## 2. Tiêu Chí Đánh Giá Nghiệm Thu (Acceptance Criteria)

1. **Chất lượng AI Sentiment**: Kết quả phân loại cảm xúc comment của Gemini phản ánh chính xác ngôn ngữ sinh viên (nhận diện được tiếng lóng, mỉa mai, viết tắt).
2. **Tóm tắt Dư luận đầy đủ**: Trường `comments_ai_summary` thể hiện được ít nhất 2 luận điểm chính của sinh viên và trích xuất đúng các thực thể (phòng học, địa điểm nếu có).
3. **dbt Chạy Thành Công**: Tất cả các models `stg_fb_comments`, `stg_ai_comment_analysis`, `mrt_post_comments_detail`, `mrt_trending_issues_dashboard` build thành công với status `SUCCESS`.
4. **Reverse ETL Hoàn Hảo**:
   - Dữ liệu bình luận được insert/upsert thành công vào bảng `dashboard_post_comments` trên PostgreSQL.
   - Bảng `dashboard_trending_issues` có giá trị `is_comments_crawled = TRUE` và có nội dung tóm tắt trong `comments_ai_summary`.
   - Không xuất hiện lỗi kết nối SSL hay duplicate key error.

---

## 3. Checklist Rà Soát (Audit Checklist)

- [x] **3.1. AI Script**: Tạo `data-pipeline/ai_processing/ai_processor_comments.py` với cấu trúc cây phân cấp `build_conversation_threads`.
- [x] **3.2. Batch Prompting**: Kiểm thử batching phân tích sentiment Gemini 2.5 Flash trên dữ liệu thật thành công (`HTTP 200 OK`).
- [x] **3.3. Synthesis Prompting**: Kiểm thử prompt tổng hợp dư luận toàn bộ comment của bài viết, bóc tách chính xác `comments_summary`, `urgency_level` và `negative_comments_ratio`.
- [x] **3.4. dbt AI Staging**: Đã chuẩn bị sẵn `models/staging/stg_ai_comment_analysis.sql` và `.yml`.
- [x] **3.5. dbt Comments Mart**: Đã chuẩn bị sẵn `models/marts/mrt_post_comments_detail.sql` và `.yml`.
- [x] **3.6. dbt Dashboard Mart Update**: Cập nhật logic tính ratio và merge summary trong `mrt_trending_issues_dashboard.sql`.
- [x] **3.7. Reverse ETL Script**: Cập nhật `data-pipeline/services/reverse_etl.py` sync đồng thời `dashboard_trending_issues` và `dashboard_post_comments` bằng `dlt`.
- [x] **3.8. Prefect Flow**: Cập nhật `data-pipeline/prefect-flow/run_pipeline.py` tích hợp các task targeted comments vào luồng chạy tự động.
- [x] **3.9. Integration Verification**: Kiểm tra cú pháp và kết nối logic giữa các modules hoàn tất 100%.
