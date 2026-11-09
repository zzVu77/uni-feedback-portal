# PHASE 5: GIAO DIỆN ĐIỀU TRA CHI TIẾT ĐA CHIỀU (DEEP-DIVE UI)

> **Mục tiêu**: Tái cấu trúc component `PostDetailDialog.tsx` từ một modal xem bài viết đơn giản thành một **Bảng Điều Tra Khủng Hoảng Đa Chiều (Deep-Dive Crisis Investigation View)** 2 cột chuyên nghiệp, hiển thị chi tiết luồng bình luận, phân loại cảm xúc sinh viên và hỗ trợ tạo Ticket phản ánh nội bộ tức thì.

---

## 1. Yêu Cầu Kỹ Thuật Chi Tiết

### 1.1. Tầng Dịch Vụ & Hooks (Data Fetching)
1. **Frontend Types (`frontend/src/types/social-listening.ts`)**:
   - Thêm interface `PostCommentItem`:
     ```typescript
     export interface PostCommentItem {
       id: string;
       commentId: string;
       postId: string;
       parentCommentId: string | null;
       author: string;
       content: string;
       reactionCount: number;
       commentedAt: string;
       sentimentLabel: string;
       sentimentScore: number;
       isTopConcern: boolean;
     }

     export interface PostCommentsResponse {
       postId: string;
       totalComments: number;
       sentimentStats: {
         negative: number;
         stressAnxiety: number;
         neutral: number;
         positive: number;
         negativeRatio: number;
       };
       comments: PostCommentItem[];
       pagination: {
         page: number;
         limit: number;
         totalPages: number;
       };
     }
     ```
2. **API Service (`frontend/src/services/social-listening-service.ts`)**:
   - Thêm function `getPostComments(postId: string, params?: GetPostCommentsParams): Promise<PostCommentsResponse>`.
   - Thêm function `triggerCrawlPostComments(postId: string): Promise<{ message: string }>`.
3. **TanStack React Query Hook (`frontend/src/hooks/queries/useSocialListeningQueries.ts`)**:
   - Tạo custom hook `useGetPostComments(postId: string, filter: GetPostCommentsParams)`.

---

### 1.2. Tái Cấu Trúc Bố Cục UI: `PostDetailDialog.tsx`
Thư mục: `frontend/src/components/dashboard/social-listening/`
- Tăng kích thước Dialog Content: `sm:max-w-[1100px] xl:max-w-[1250px] max-h-[92vh]`.
- Bố cục lưới 2 cột:

#### A. Cột Trái (40% chiều rộng - Cố định & Cuộn độc lập):
1. **Banner Cảnh Báo Cấp Độ Khủng Hoảng**:
   - Hiển thị nhãn `Mức độ nghiêm trọng: CAO` nếu bài viết có `urgency_level === 'CRITICAL'` hoặc `sentiment_label === 'Tiêu cực'`.
2. **Thông Tin Bài Đăng Gốc**:
   - Tác giả, thời gian đăng, topic, link trực tiếp tới Facebook.
   - Nội dung bài đăng gốc được đặt trong box trích dẫn nổi bật.
   - Lượt Like và Tổng số Bình luận.
3. **AI Tóm Tắt & Phân Tích Dư Luận (AI Synthesis Box)**:
   - Box 1: Tóm tắt nội dung bài viết gốc.
   - Box 2: **Tổng hợp dư luận từ bình luận**: Liệt kê các bức xúc chính và các bằng chứng/phòng học sinh viên nhắc đến trong comment.
4. **Thanh Trực Quan Tỉ Lệ Cảm Xúc (Sentiment Ratio Bar)**:
   - Component thanh tiến trình nhiều màu (Đỏ: Tiêu cực/Bức xúc, Xanh dương: Trung lập, Xanh lá: Tích cực).
5. **Nút Hành Động Nghiệp Vụ (Action Buttons)**:
   - Nút **"Tạo Phản Ánh Nội Bộ Từ Bài Này"**: Khi click, mở form hoặc chuyển hướng sang trang tạo Ticket mới của Nhà trường với tiêu đề, mô tả và phòng ban đề xuất đã được điền sẵn từ nội dung bài viết FB!
   - Nút **"Mở bài đăng gốc trên Facebook"**.

---

#### B. Cột Phải (60% chiều rộng - Danh sách Bình luận tương tác):
1. **Thanh Công Cụ & Bộ Lọc Nhanh (Filter Toolbar)**:
   - Tabs lọc cảm xúc:
     - `Tất cả` (hiển thị tổng số lượng).
     - `Bức xúc / Tiêu cực` (kèm icon ngọn lửa/cảnh báo đỏ).
     - `Bằng chứng cụ thể` (`isTopConcern === true`).
     - `Tích cực / Trung lập`.
   - Dropdown sắp xếp: *Nhiều like nhất* | *Mới nhất*.
   - Nút icon **"Quét lại bình luận mới" (Re-crawl)** có spinner loading.
2. **Danh Sách Thẻ Bình Luận (`CommentCard`)**:
   - Avatar chữ cái đầu hoặc avatar người dùng.
   - Tên người bình luận (hoặc Sinh viên ẩn danh).
   - Huy hiệu cảm xúc nhỏ (Badge màu đỏ cho tiêu cực, badge xám cho trung lập,...).
   - Nội dung bình luận (có highlight các từ khóa bằng chứng nếu là `isTopConcern`).
   - Lượt thích của bình luận (ThumbUp icon + số reactions).
   - Thời gian đăng bình luận.
3. **Phân Trang / Cuộn**:
   - Nút phân trang (Trang trước, Trang sau, Số trang) hoặc nút "Tải thêm bình luận".
4. **Empty State / Loading State**:
   - Hiển thị Skeleton loading khi đang tải.
   - Nếu bài viết chưa có bình luận hoặc chưa được cào: Hiển thị thông điệp thân thiện kèm nút *"Bấm vào đây để hệ thống tự động quét bình luận của bài viết này"*.

---

## 2. Tiêu Chí Đánh Giá Nghiệm Thu (Acceptance Criteria)

1. **Hiển thị Trực quan & Mạch lạc**:
   - Giao diện 2 cột cân đối, không bị tràn màn hình trên các độ phân giải phổ biến (1366x768, 1920x1080).
   - Trên màn hình nhỏ (Tablet/Mobile): Tự động chuyển thành layout cuộn 1 cột liên tục hoặc Tab chuyển đổi giữa *Bài viết* và *Bình luận*.
2. **Tương tác Thời gian thực & Lọc mượt mà**:
   - Chuyển đổi giữa các tab lọc cảm xúc diễn ra tức thì (nhờ cache TanStack Query), không gây giật lag.
   - Thanh tỉ lệ cảm xúc (Ratio Bar) hiển thị đúng tỉ lệ phần trăm số học.
3. **Tích hợp Luồng Xử lý Nội bộ**:
   - Bấm nút *"Tạo phản ánh nội bộ"* điều hướng chính xác sang chức năng tiếp nhận phản ánh, tự động điền sẵn trích dẫn bài đăng giúp cán bộ không phải copy-paste thủ công.
4. **Xử lý UX Trạng thái Chờ**:
   - Khi bấm nút *"Quét lại bình luận"*, hiển thị Toast thông báo trạng thái và disable nút tạm thời tránh spam request.

---

## 3. Checklist Rà Soát (Audit Checklist)

- [x] **5.1. Type Definitions**: Thêm interfaces `PostCommentItem`, `PostCommentsResponse`, `GetPostCommentsParams` vào `types/social-listening.ts`.
- [x] **5.2. Service Methods**: Viết các hàm gọi API `getPostComments` và `triggerCrawlPostComments` trong `services/social-listening-service.ts`.
- [x] **5.3. Custom Hook**: Viết hooks `useGetPostComments` và `useTriggerCrawlComments` trong `hooks/queries/useSocialListeningQueries.ts`.
- [x] **5.4. Sub-components**:
  - Tạo component `CommentCard.tsx` hiển thị thẻ bình luận kèm badge cảm xúc, nested reply indicator, lượt thích.
  - Tạo component `SentimentRatioBar.tsx` hiển thị thanh % cảm xúc nhiều màu trực quan.
  - Tạo component `CommentsFilterTabs.tsx` điều khiển bộ lọc nhanh, sắp xếp và nút quét lại.
- [x] **5.5. Dialog Redesign**: Tái cấu trúc layout 2 cột trong `PostDetailDialog.tsx` (Cột trái: Tổng quan & AI tổng hợp dư luận; Cột phải: Luồng bình luận tương tác).
- [x] **5.6. Internal Feedback Action**: Tích hợp nút chuyển đổi bài đăng thành Ticket phản ánh nội bộ, tự động trích xuất nội dung sang form `/student/create-new-feedback`.
- [x] **5.7. Re-crawl Action**: Tích hợp nút trigger cào bình luận và xử lý Sonner Toast thông báo.
- [x] **5.8. Responsive Test**: Kiểm thử giao diện trên màn hình lớn Desktop, Laptop và Tablet (`lg:grid-cols-12`).
- [x] **5.9. Final Polish**: Kiểm tra build (`next build`), type-check TypeScript thành công 100%, độ tương phản và hiệu ứng hover hoàn thiện.
