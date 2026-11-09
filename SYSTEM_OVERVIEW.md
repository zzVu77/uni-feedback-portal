# TỔNG QUAN TOÀN BỘ HỆ THỐNG UNI FEEDBACK PORTAL

> **Dự án**: Cổng tiếp nhận, quản lý và xử lý phản ánh, khiếu nại sinh viên tích hợp Trí tuệ Nhân tạo (HCMUTE Uni Feedback Portal).  
> **Cấu trúc repo**: Monorepo (`backend`, `frontend`, `data-pipeline`).

---

## 1. Mục tiêu và Giới thiệu Dự án

**Uni Feedback Portal** là nền tảng số hóa toàn diện quy trình tiếp nhận, chuyển tiếp, xử lý và phản hồi các ý kiến đóng góp, khiếu nại, phản ánh từ sinh viên đến các phòng ban chức năng trong nhà trường (Cơ sở vật chất, Đào tạo, Khảo thí, Công tác sinh viên, Học phí,...).

### Điểm nổi bật của hệ thống:
1. **Kiểm duyệt & Định tuyến thông minh bằng AI**:
   - Tự động kiểm tra độc hại (Toxicity Check) bằng từ khóa kết hợp mô hình LLM (**Google Gemini 2.5 Flash**).
   - Tự động gợi ý phòng ban tiếp nhận dựa trên ngữ nghĩa văn bản bằng **Gemini Embeddings** và tìm kiếm vector tương đồng qua **PostgreSQL pgvector**.
   - Phát hiện các phản ánh trùng lặp / tương tự giữa các sinh viên nhờ **pgvector Cosine Similarity** và **Cohere Rerank API**.
2. **Quy trình xử lý phản ánh đa cấp**:
   - Luồng trạng thái phản ánh minh bạch, ghi vết lịch sử thay đổi (`FeedbackStatusHistory`).
   - Khả năng chuyển tiếp phản ánh linh hoạt giữa các phòng ban (`ForwardingLogs`).
   - Đánh giá chất lượng xử lý và mức độ hài lòng của sinh viên (`FeedbackRatings`).
3. **Kênh làm rõ thông tin thời gian thực (Clarification Channels)**:
   - Cho phép chuyên viên và sinh viên mở cuộc hội thoại chat kín trực tiếp để làm rõ thông tin, bổ sung chứng từ hình ảnh/file đính kèm trước khi đưa ra kết luận xử lý.
4. **Diễn đàn thảo luận công khai (Community Forum)**:
   - Các phản ánh không bảo mật (`isPrivate: false`) được đưa lên diễn đàn sinh viên để bình chọn (upvote), bình luận lồng nhau (nested comments) và báo cáo vi phạm nội dung xấu.
5. **Lắng nghe Mạng xã hội (Social Listening & Trending Issues)**:
   - Data pipeline (Python, Prefect, dlt, dbt) thu thập bài đăng từ các hội nhóm sinh viên, phân tích chỉ số cảm xúc (Sentiment: Tích cực, Tiêu cực, Trung lập, Stress lo âu) và tổng hợp các chủ đề "nóng" giúp Ban Giám hiệu nắm bắt tâm tư dư luận học đường.
6. **Báo cáo phân tích định kỳ bằng AI (AI Analytics)**:
   - Tự động quét và tóm tắt xu hướng phản ánh hàng tuần/tháng, cảnh báo các vấn đề phát sinh nổi bật.

---

## 2. Kiến trúc Hệ thống Tổng thể

```mermaid
flowchart TB
    subgraph ClientLayer ["Client / Presentation Layer"]
        WebStudent["Web App (Sinh viên)"]
        WebStaff["Web Portal (Cán bộ Phòng ban)"]
        WebAdmin["Web Admin (Quản trị viên)"]
        PWA["PWA (Service Worker Push)"]
    end

    subgraph GatewayFrontend ["Frontend - Next.js 15 (App Router)"]
        Middleware["Next.js Middleware (RBAC & Token Verify)"]
        AppRoutes["App Router Pages & Server Actions"]
        ClientState["TanStack Query + Socket.io Client"]
    end

    subgraph BackendAPI ["Backend - NestJS 11 Application"]
        AuthModule["Auth & RBAC (JWT + Refresh Cookie)"]
        FeedbackModule["Feedbacks & Management Module"]
        ForumModule["Forum & Comment Module"]
        ClarificationModule["Clarifications & WebSocket Gateway"]
        NotificationModule["Notifications & Mail Module"]
        AIService["AI Engine (Gemini & Cohere)"]
        SocialListening["Social Listening Module"]
        BullMQWorker["BullMQ Queue & Background Workers"]
        CronSchedulers["Scheduler (Weekly/Monthly AI Reports)"]
    end

    subgraph DataPipelineSubsystem ["Data Pipeline (ELT & Social Crawl)"]
        Crawler["Facebook / Forum Crawler"]
        DltEngine["dlt (Data Load Tool)"]
        PrefectOrch["Prefect Workflow Orchestration"]
        DbtTransform["dbt Transformations & BigQuery"]
    end

    subgraph StorageLayer ["Data & Storage Layer"]
        PostgresDB[("PostgreSQL 15 + pgvector Extension")]
        RedisCache[("Redis (BullMQ & Cache)")]
        S3Storage[("AWS S3 / Supabase Storage (Presigned Files)")]
    end

    ClientLayer --> GatewayFrontend
    GatewayFrontend --> BackendAPI
    BackendAPI --> StorageLayer
    DataPipelineSubsystem --> PostgresDB
    BackendAPI -.->|"Trigger Dispatches"| DataPipelineSubsystem
    AIService -.->|"LLM & Embedding Calls"| GoogleGemini["Google Gemini API"]
    AIService -.->|"Semantic Reranking"| CohereAPI["Cohere API"]
```

---

## 3. Cấu trúc Thư mục Monorepo

```
uni-feedback-portal/
├── backend/                   # Ứng dụng Backend API NestJS
│   ├── db/                    # Docker Compose & init script cho Postgres pgvector
│   ├── prisma/                # Prisma ORM Schema & Migrations
│   │   └── schema.prisma      # Định nghĩa toàn bộ Database Models, Enums, Relations
│   └── src/
│       ├── main.ts            # Entrypoint, CORS, Swagger UI, ValidationPipe, CookieParser
│       ├── app.module.ts      # Root Module tập hợp tất cả feature modules
│       ├── config/            # JWT, Database, Mail, Redis configuration
│       └── modules/           # Các domain modules nghiệp vụ:
│           ├── auth/                  # Đăng nhập, Quên MK qua OTP, Refresh Token, Guards
│           ├── users/                 # Quản lý người dùng, phân quyền, cập nhật hồ sơ
│           ├── departments/           # Quản trị phòng ban & sinh vector embedding
│           ├── categories/            # Danh mục khiếu nại/góp ý
│           ├── feedbacks/             # Sinh viên tạo/sửa/xem/resubmit/đánh giá feedback
│           ├── feedback_management/   # Cán bộ tiếp nhận, xử lý, gán việc, chuyển tiếp
│           ├── feedback-similarity/   # Tìm kiếm feedback tương đồng (Cosine + Cohere Rerank)
│           ├── forum/                 # Diễn đàn công khai, bài post, lượt upvote
│           ├── comment/               # Bình luận đa cấp (hỗ trợ Post và Announcement)
│           ├── moderation/            # Báo cáo và xử lý vi phạm bình luận
│           ├── clarifications/        # Kênh chat trực tiếp làm rõ feedback (WebSocket)
│           ├── announcements/         # Quản lý & phát hành thông báo trường/phòng ban
│           ├── notifications/         # Quản lý thông báo real-time & lưu lịch sử
│           ├── uploads/               # S3 Presigned URL tải file an toàn
│           ├── mail/                  # Dịch vụ gửi email template (OTP, thông báo xử lý)
│           ├── redis/                 # Caching và Redis client
│           ├── ai/                    # Gemini 2.5 Flash, kiểm tra độc hại, gợi ý phòng ban
│           ├── ai-analytics/          # Cron job tóm tắt xu hướng và cảm xúc định kỳ
│           ├── toxic-keywords/        # Quản lý từ khóa nhạy cảm / cấm
│           ├── social_listening/      # API Dashboard xu hướng mạng xã hội
│           ├── social_data_source/    # Quản lý link/nguồn nhóm cần theo dõi
│           └── github-action/         # Trigger GitHub Actions chạy crawler từ xa
│
├── frontend/                  # Ứng dụng Frontend Next.js 15
│   ├── public/                # Static assets, icons, PWA manifest
│   ├── src/
│   │   ├── app/               # Next.js App Router (Routing theo vai trò & tính năng)
│   │   │   ├── (auth)/        # Trang Đăng nhập, Đăng ký, Quên mật khẩu, Reset OTP
│   │   │   ├── student/       # Khu vực dành cho Sinh viên (Gửi góp ý, theo dõi hồ sơ)
│   │   │   ├── staff/         # Khu vực dành cho Cán bộ phòng ban (Xử lý, gán việc)
│   │   │   ├── staff-assistant/# Khu vực dành cho Trợ lý cán bộ
│   │   │   ├── admin/         # Khu vực Admin (Quản trị phòng ban, user, AI, data source)
│   │   │   ├── forum/         # Diễn đàn sinh viên công khai
│   │   │   ├── notifications/ # Trung tâm thông báo
│   │   │   └── api/auth/      # Route Handler xử lý Refresh Token, Set Cookies
│   │   ├── components/        # UI Components tái sử dụng (Radix UI, Tailwind)
│   │   │   ├── common/        # Header, Sidebar, StatusBadge, Pagination, FileUpload
│   │   │   ├── conversation/  # Khung chat trao đổi làm rõ (ChatSheet, MessageList)
│   │   │   ├── forum/         # PostCard, CommentTree, UpvoteButton
│   │   │   └── ui/            # Base atomic UI elements (Buttons, Dialogs, Toasts)
│   │   ├── hooks/             # Custom React Hooks & TanStack Query Queries/Mutations
│   │   ├── services/          # Các tầng gọi API Axios phân tách theo module
│   │   ├── context/           # UserContext, SocketContext quản lý trạng thái toàn cục
│   │   ├── types/             # Định nghĩa Type/Interface TypeScript toàn hệ thống
│   │   └── middleware.ts      # Middleware chặn route, kiểm tra JWT và điều hướng RBAC
│
├── data-pipeline/             # Hệ thống Data Pipeline & Crawling
│   ├── dbt_transformation/    # Dự án dbt chuẩn hóa và chuyển đổi dữ liệu
│   ├── requirements.txt       # Dependencies: prefect, dlt, google-genai, dbt-bigquery
│   └── README.md              # Hướng dẫn thiết lập môi trường Python/dbt
│
└── package.json               # Monorepo cấu hình script chạy song song npm workspaces
```

---

## 4. Các Phân hệ & Luồng Nghiệp vụ Trọng tâm

### 4.1. Phân quyền Người dùng (RBAC) & Xác thực
Hệ thống xác định 4 vai trò rõ ràng:
- **`STUDENT` (Sinh viên)**: Gửi phản ánh, theo dõi tiến độ, tham gia trao đổi làm rõ, xem diễn đàn, bình chọn/bình luận, đánh giá chất lượng phản hồi.
- **`DEPARTMENT_STAFF` (Cán bộ Phòng ban)**: Nhận phản ánh thuộc phòng ban, tiếp nhận/từ chối/chuyển tiếp phản ánh, gán việc cho trợ lý/chuyên viên, trao đổi với sinh viên, cập nhật kết quả xử lý.
- **`STAFF_ASSISTANT` (Trợ lý Cán bộ)**: Hỗ trợ xử lý và tương tác trực tiếp với sinh viên theo phản ánh được giao.
- **`ADMIN` (Quản trị viên Nhà trường)**: Quản lý người dùng, phòng ban, danh mục, từ khóa nhạy cảm, kiểm duyệt nội dung bị báo cáo, theo dõi Dashboard Social Listening và báo cáo AI.

**Cơ chế Authentication**:
- **Access Token**: JWT thời hạn ngắn (15-60 phút) dùng để xác thực request.
- **Refresh Token**: Lưu trữ trong cơ sở dữ liệu (`RefreshTokens`), trả về qua HttpOnly Cookie bảo mật cao.
- **Auto Refreshing**: Next.js `middleware.ts` tự động phát hiện access token hết hạn và gọi `/api/auth/refresh` bằng refresh token để cấp lại phiên làm việc mà không làm gián đoạn người dùng.

---

### 4.2. Vòng đời Xử lý Phản ánh (Feedback Lifecycle)

```mermaid
stateDiagram-v2
    [*] --> AI_REVIEWING: Sinh viên gửi phản ánh mới
    AI_REVIEWING --> VIOLATED_CONTENT: Phát hiện từ ngữ độc hại/nhạy cảm
    AI_REVIEWING --> AI_REVIEW_FAILED: Lỗi kết nối dịch vụ AI
    AI_REVIEWING --> PENDING: Nội dung hợp lệ (AI kiểm duyệt thành công)
    
    VIOLATED_CONTENT --> AI_REVIEWING: Sinh viên chỉnh sửa & Resubmit
    AI_REVIEW_FAILED --> PENDING: Admin/Hệ thống duyệt thủ công
    
    PENDING --> IN_PROGRESS: Cán bộ phòng ban tiếp nhận xử lý
    PENDING --> REJECTED: Từ chối phản ánh (kèm lý do)
    
    IN_PROGRESS --> IN_PROGRESS: Chuyển tiếp phòng ban khác (Forwarding)
    IN_PROGRESS --> RESOLVED: Đã xử lý & đưa ra kết luận giải quyết
    IN_PROGRESS --> REJECTED: Không thể xử lý/Bác bỏ yêu cầu
    
    RESOLVED --> [*]: Sinh viên đánh giá độ hài lòng (1-5 sao)
    REJECTED --> [*]
```

1. **Khởi tạo & Kiểm duyệt AI**:
   - Khi sinh viên gửi phản ánh, hệ thống đưa vào trạng thái `AI_REVIEWING`.
   - AI Engine quét từ khóa vi phạm (`ToxicKeyword`) và gửi nội dung đến **Gemini 2.5 Flash**.
   - Nếu vi phạm chuẩn mực văn hóa học đường, phản ánh chuyển sang `VIOLATED_CONTENT` và gửi thông báo để sinh viên chỉnh sửa.
2. **Định tuyến & Gợi ý phòng ban**:
   - Trường hợp sinh viên không rõ đơn vị nào chịu trách nhiệm, AI Engine tự động chuyển nội dung thành Vector thông qua `gemini-embedding-2-preview`, tính khoảng cách cosine với `DepartmentEmbeddings` trong database và đưa ra đề xuất phòng ban phù hợp nhất.
3. **Phát hiện phản ánh tương đồng**:
   - Giúp cán bộ phát hiện nhanh các phản ánh về cùng một sự cố (ví dụ: mất điện, hỏng máy chiếu, lỗi phần mềm tín chỉ) bằng thuật toán kết hợp Vector Cosine Similarity và Cohere Rerank.
4. **Xử lý & Chuyển tiếp (Forwarding)**:
   - Nếu phản ánh gửi nhầm phòng ban, cán bộ có quyền chuyển tiếp sang phòng ban khác (`ForwardingLogs`), ghi chú lý do chuyển tiếp.
5. **Đánh giá phản hồi**:
   - Khi phản ánh đạt trạng thái `RESOLVED`, sinh viên có thể đánh giá điểm số (1 đến 5 sao) và để lại nhận xét đóng góp chất lượng phục vụ.

---

### 4.3. Kênh Trao đổi Làm rõ (Clarification Channel)
- Nhằm tránh tình trạng từ chối phản ánh do "thiếu thông tin/chứng cứ", cán bộ phòng ban có thể khởi tạo cuộc trao đổi (`ClarificationConversations`).
- Giao diện chat thời gian thực qua **WebSocket (Socket.io)** hỗ trợ gửi tin nhắn văn bản và đính kèm tài liệu/hình ảnh thông qua **AWS S3 Presigned URLs**.
- Sau khi sinh viên cung cấp đủ thông tin, cuộc trao đổi có thể đóng lại và tiến trình xử lý tiếp tục.

---

### 4.4. Diễn đàn Sinh viên & Kiểm duyệt Nội dung (Forum & Moderation)
- Những phản ánh công khai (`isPrivate: false`) sau khi duyệt sẽ tạo bản ghi tương ứng tại `ForumPosts`.
- **Cơ chế tương tác**:
  - Upvote / hủy Upvote bài viết.
  - Bình luận đa cấp: Trả lời trực tiếp vào bài viết hoặc trả lời lồng nhau vào bình luận của người khác (`parentId`).
- **Kiểm duyệt (Moderation)**:
  - Sinh viên có thể gửi báo cáo (`CommentReports`) đối với các bình luận sai lệch, quấy rối.
  - Admin có trang kiểm duyệt chuyên biệt để xem xét nội dung bị báo cáo, đưa ra quyết định `VIOLATION` (xóa bình luận và thông báo người vi phạm) hoặc `NO_VIOLATION`.

---

### 4.5. Phân hệ Lắng nghe Mạng xã hội (Social Listening & Analytics)
- Thu thập bài viết từ fanpage, nhóm sinh viên (được cấu hình trong `DataSources`).
- Quy trình ETL/ELT:
  - **dlt (data load tool)** nạp dữ liệu thô vào cơ sở dữ liệu.
  - Mô hình AI tiến hành phân loại cảm xúc (Tích cực, Tiêu cực, Trung lập, Stress/Lo âu) và tóm tắt nội dung chính.
  - Cung cấp Dashboard đo lường: Chỉ số KPI, biểu đồ phân bổ cảm xúc, độ tương tác (reaction, comment), danh sách các vấn đề nổi cộm theo thời gian thực.
  - **AI Analytics Service**: Cron job tự động quét toàn bộ phản ánh học đường theo tuần/tháng, tạo báo cáo tổng hợp bằng Gemini (`AiFeedbackSummaries`).

---

## 5. Cơ sở Dữ liệu & Mô hình Dữ liệu (Prisma Schema)

Hệ thống sử dụng **PostgreSQL** kết hợp extension **pgvector** với các thực thể cốt lõi sau:

| Bảng (Model) | Mô tả chính |
| :--- | :--- |
| **`Users`** | Lưu thông tin người dùng, mật khẩu mã hóa (bcrypt), vai trò (`UserRole`), trạng thái (`UserStatus`), liên kết phòng ban. |
| **`Departments`** | Danh sách các phòng ban trong trường, thông tin liên hệ, trạng thái hoạt động. |
| **`DepartmentEmbeddings`** | Lưu trữ vector nhúng của phòng ban phục vụ thuật toán định tuyến phản ánh AI. |
| **`Categories`** | Danh mục phân loại phản ánh (Cơ sở vật chất, Học phí, Đào tạo,...). |
| **`Feedbacks`** | Thực thể chính lưu phản ánh: tiêu đề, mô tả, vị trí, trạng thái (`FeedbackStatus`), cờ riêng tư (`isPrivate`), phòng ban, người xử lý (`assigneeId`). |
| **`FeedbackEmbeddings`** | Vector nhúng của từng phản ánh (kiểu dữ liệu `vector` của pgvector). |
| **`FeedbackSimilarityLink`** | Lưu liên kết và điểm tương đồng giữa các phản ánh có nội dung tương tự. |
| **`FeedbackStatusHistory`** | Lịch sử vết trạng thái phản ánh, ghi nhận thông điệp và ghi chú của cán bộ xử lý. |
| **`ForwardingLogs`** | Nhật ký chuyển tiếp phản ánh giữa các phòng ban. |
| **`FeedbackRatings`** | Đánh giá mức độ hài lòng của sinh viên sau khi phản ánh được giải quyết xong. |
| **`ClarificationConversations`** | Phiên thảo luận kín giữa sinh viên và phòng ban để làm rõ thông tin phản ánh. |
| **`Messages`** | Nội dung tin nhắn trong phiên thảo luận làm rõ. |
| **`ForumPosts`** | Bài đăng trên diễn đàn công khai tương ứng với phản ánh. |
| **`Votes`** | Lượt upvote của người dùng cho bài đăng diễn đàn. |
| **`Comments`** | Bình luận đa cấp hỗ trợ diễn đàn và thông báo trường. |
| **`CommentReports`** | Báo cáo vi phạm bình luận gửi tới ban quản trị. |
| **`Announcements`** | Bảng tin thông báo chung từ ban giám hiệu hoặc các phòng ban. |
| **`Notifications`** | Hệ thống thông báo người dùng theo thời gian thực (hỗ trợ nhiều loại `NotificationType`). |
| **`FileAttachments`** | Quản lý metadata file đính kèm trên cloud storage (S3) theo đối tượng (`FileTargetType`). |
| **`RefreshTokens`** | Token làm mới phiên đăng nhập của người dùng. |
| **`DashboardTrendingIssues`** | Dữ liệu bài viết mạng xã hội đã qua phân tích cảm xúc & AI tóm tắt từ data pipeline. |
| **`DataSources`** | Danh sách các group/fanpage mạng xã hội đang theo dõi. |
| **`AiFeedbackSummaries`** | Báo cáo phân tích tổng quan phản ánh định kỳ hàng tuần/tháng do AI sinh ra. |
| **`ToxicKeyword`** | Danh sách các từ khóa nhạy cảm / độc hại dùng trong bộ lọc ban đầu. |

---

## 6. Công nghệ Sử dụng trong Dự án

### 6.1. Backend
- **Framework**: NestJS v11 (TypeScript)
- **Database ORM**: Prisma ORM v6.16 với PostgreSQL 15 + `pgvector`
- **Real-time**: `@nestjs/websockets` + Socket.io v4.8
- **Background Jobs / Queue**: BullMQ & Redis (`@nestjs/bullmq`)
- **Cron Jobs**: `@nestjs/schedule`
- **AI Integration**:
  - `@google/genai` (Google Gemini 2.5 Flash, Gemini Embedding)
  - `cohere-ai` (Cohere Rerank API)
- **Cloud Storage**: AWS S3 SDK (`@aws-sdk/client-s3`, presigned URLs)
- **Email Service**: `@nestjs-modules/mailer` + Nodemailer
- **Tài liệu API**: Swagger UI (`@nestjs/swagger`)

### 6.2. Frontend
- **Framework**: Next.js v15.5 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, Radix UI Primitives, Lucide Icons, `tw-animate-css`
- **Data Fetching & Cache**: TanStack React Query v5, Axios
- **Form & Validation**: React Hook Form, Zod Resolver
- **Real-time Client**: `socket.io-client`
- **Biểu đồ & Báo cáo**: Recharts, Chart.js, `@react-pdf/renderer`
- **PWA**: `@serwist/next` (Service Worker cho offline caching và Push Notifications)

### 6.3. Data Pipeline & Analytics
- **Ngôn ngữ**: Python 3.10+
- **Công cụ Pipeline**: `dlt` (data load tool) nạp dữ liệu Postgres/BigQuery, `prefect` điều phối luồng
- **Biến đổi Dữ liệu**: `dbt` (data build tool), Pandas, SQLAlchemy
- **AI Phân tích Dữ liệu**: `google-genai`

---

## 7. Hướng dẫn Khởi chạy Môi trường Phát triển

### 7.1. Yêu cầu hệ thống
- **Node.js**: phiên bản `>= 18.0.0`
- **npm**: phiên bản `>= 8.0.0`
- **Docker & Docker Compose**: Dùng để chạy PostgreSQL có hỗ trợ pgvector và Redis
- **Python**: `>= 3.10` (nếu làm việc với `data-pipeline`)

### 7.2. Cài đặt Dependencies
Tại thư mục gốc của repository:
```bash
npm install
```

### 7.3. Cấu hình Biến Môi trường
- **Backend**: Tạo file `backend/.env`:
  ```env
  PORT=8080
  DATABASE_URL="postgresql://root:123456@localhost:5433/UniversityFeedback?schema=public"
  JWT_ACCESS_SECRET="your-access-secret"
  JWT_REFRESH_SECRET="your-refresh-secret"
  REDIS_HOST="localhost"
  REDIS_PORT=6379
  API_GEMINI_KEY="your-gemini-api-key"
  COHERE_API_KEY="your-cohere-api-key"
  AWS_ACCESS_KEY_ID="your-s3-key"
  AWS_SECRET_ACCESS_KEY="your-s3-secret"
  AWS_REGION="ap-southeast-1"
  AWS_BUCKET_NAME="uni-feedback-attachments"
  MAIL_HOST="smtp.gmail.com"
  MAIL_USER="your-email@gmail.com"
  MAIL_PASS="your-app-password"
  ```
- **Frontend**: Tạo file `frontend/.env.local`:
  ```env
  NEXT_PUBLIC_BASE_URL="http://localhost:8080"
  NEXT_PUBLIC_SOCKET_URL="http://localhost:8080"
  JWT_ACCESS_SECRET="your-access-secret"
  ```

### 7.4. Khởi chạy Database
```bash
# Khởi động PostgreSQL container kèm pgvector
npm run db:up --workspace=backend

# Khởi tạo pgvector extension (nếu chưa tự tạo)
npm run db:init-vector --workspace=backend

# Chạy migrations Prisma
npm run migration:deploy --workspace=backend

# Khởi tạo seed dữ liệu ban đầu
npm run db:seed --workspace=backend

# Tạo vector embedding mẫu cho các phòng ban
npm run seed:dept --workspace=backend
```

### 7.5. Khởi động Ứng dụng
Chạy đồng thời cả Frontend và Backend từ thư mục gốc:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API Server**: [http://localhost:8080](http://localhost:8080)
- **Swagger API Docs**: [http://localhost:8080/api](http://localhost:8080/api)
- **Prisma Studio**: `npx prisma studio` (chạy bên trong thư mục `backend`)

---

## 8. Kết luận & Tiềm năng Mở rộng
Hệ thống **Uni Feedback Portal** giải quyết trọn vẹn bài toán tiếp nhận và xử lý thông tin phản ánh trong môi trường đại học. Nhờ việc tích hợp trí tuệ nhân tạo (Gemini & pgvector), nền tảng không chỉ số hóa quy trình truyền thống mà còn tự động hóa khâu tiền kiểm duyệt, tối ưu định tuyến phản ánh, phát hiện vấn đề trùng lặp và cung cấp góc nhìn toàn cảnh về tâm tư sinh viên thông qua Social Listening.
