# PHASE 4: DỊCH VỤ BACKEND & API CUNG CẤP DỮ LIỆU (NESTJS BACKEND)

> **Mục tiêu**: Xây dựng tầng Service, Controller và DTOs trong NestJS Backend để truy vấn danh sách bình luận đã phân tích, thống kê tỉ lệ cảm xúc và cung cấp endpoint cho phép Admin kích hoạt cào bình luận theo yêu cầu (on-demand).

---

## 1. Yêu Cầu Kỹ Thuật Chi Tiết

### 1.1. DTOs & Phân Trang / Lọc
Thư mục: `backend/src/modules/social_listening/dto/`
- Tệp tin mới: `get-post-comments.dto.ts`:
  ```typescript
  import { ApiPropertyOptional } from '@nestjs/swagger';
  import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
  import { Type } from 'class-transformer';

  export class GetPostCommentsDto {
    @ApiPropertyOptional({ description: 'Số trang', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Số lượng comment mỗi trang', default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;

    @ApiPropertyOptional({ description: 'Lọc theo cảm xúc: Tiêu cực, Tích cực, Trung lập, Bức xúc' })
    @IsOptional()
    @IsString()
    sentimentLabel?: string;

    @ApiPropertyOptional({ description: 'Lọc chỉ các bình luận nêu bằng chứng/bức xúc hàng đầu' })
    @IsOptional()
    isTopConcern?: boolean;

    @ApiPropertyOptional({ description: 'Sắp xếp: reactions (nhiều thích nhất) hoặc date (mới nhất)', default: 'reactions' })
    @IsOptional()
    @IsIn(['reactions', 'date'])
    sortBy?: 'reactions' | 'date' = 'reactions';
  }
  ```

---

### 1.2. SocialListeningService Business Logic
Thư mục: `backend/src/modules/social_listening/social_listening.service.ts`

Bổ sung các phương thức:
1. **`getPostComments(postId: string, dto: GetPostCommentsDto)`**:
   - Kiểm tra bài viết `postId` có tồn tại trong bảng `DashboardTrendingIssues` không. Nếu không, trả về `NotFoundException`.
   - Xây dựng câu truy vấn Prisma `prisma.dashboardPostComments.findMany`:
     - Điều kiện `where`: `{ postId, ...(sentimentLabel && { sentimentLabel }), ...(isTopConcern !== undefined && { isTopConcern }) }`.
     - Phân trang `skip: (page - 1) * limit`, `take: limit`.
     - Sắp xếp:
       - `sortBy === 'reactions'` ➔ `orderBy: [{ reactionCount: 'desc' }, { commentedAt: 'desc' }]`.
       - `sortBy === 'date'` ➔ `orderBy: { commentedAt: 'desc' }`.
   - Đồng thời thực hiện tính toán thống kê tổng quan (Summary stats):
     - Tổng số comment của bài viết.
     - Số lượng comment theo từng cảm xúc (`Tiêu cực`, `Bức xúc`, `Trung lập`, `Tích cực`).
     - Tỉ lệ % tiêu cực.
   - Trả về cấu trúc:
     ```json
     {
       "postId": "string",
       "totalComments": 142,
       "sentimentStats": {
         "negative": 89,
         "stressAnxiety": 22,
         "neutral": 25,
         "positive": 6,
         "negativeRatio": 78.17
       },
       "comments": [ ... ],
       "pagination": { "page": 1, "limit": 20, "totalPages": 8 }
     }
     ```

2. **`triggerCrawlPostComments(postId: string, actor: ActiveUserData)`**:
   - Lấy `postLink` của bài viết.
   - Gọi `GithubActionService` để trigger workflow cào riêng lẻ hoặc đưa job vào hàng đợi BullMQ nếu cấu hình runner nội bộ.

---

### 1.3. SocialListeningController Endpoints
Thư mục: `backend/src/modules/social_listening/social_listening.controller.ts`

Thêm 2 endpoints mới:
1. **`GET /social-listening/posts/:postId/comments`**:
   - Phân quyền: Cả `ADMIN`, `DEPARTMENT_STAFF`, `STAFF_ASSISTANT` đều có thể xem để nắm bắt thông tin.
   - Swagger: `@ApiOperation({ summary: 'Lấy danh sách bình luận chi tiết của bài viết mạng xã hội' })`.
2. **`POST /social-listening/posts/:postId/crawl-comments`**:
   - Phân quyền: `@Roles(UserRole.ADMIN)` (chỉ quản trị viên mới được trigger lệnh cào).
   - Swagger: `@ApiOperation({ summary: 'Kích hoạt cào bình luận theo yêu cầu cho bài viết' })`.

---

## 2. Tiêu Chí Đánh Giá Nghiệm Thu (Acceptance Criteria)

1. **Phân quyền Chuẩn xác**: Sinh viên thông thường không thể truy cập các endpoints này (trả về `403 Forbidden`). Cán bộ và Admin truy cập bình thường (`200 OK`).
2. **Xử lý Validation & Error**:
   - Truy vấn với `postId` không tồn tại trả về đúng mã lỗi `404 Not Found`.
   - Tham số `page` hoặc `limit` âm hoặc sai định dạng bị chặn bởi `ValidationPipe` (`400 Bad Request`).
3. **Hiệu năng & Tối ưu truy vấn**:
   - Thời gian phản hồi API `< 200ms` cho bài viết có 200+ comments nhờ index `@@index([postId])`.
   - Sắp xếp và phân trang hoạt động chính xác.
4. **Tài liệu Swagger**: Hiển thị đầy đủ DTOs, tham số query và mẫu kết quả trả về trên giao diện Swagger UI `/api`.

---

## 3. Checklist Rà Soát (Audit Checklist)

- [ ] **4.1. DTO**: Tạo file `backend/src/modules/social_listening/dto/get-post-comments.dto.ts`.
- [ ] **4.2. Service Query**: Viết method `getPostComments` trong `SocialListeningService`.
- [ ] **4.3. Service Stats**: Viết logic thống kê số lượng và tỉ lệ cảm xúc comment đi kèm kết quả.
- [ ] **4.4. Trigger Method**: Viết method `triggerCrawlPostComments` hỗ trợ cào on-demand.
- [ ] **4.5. Controller Endpoints**: Khai báo 2 routes mới trong `SocialListeningController`.
- [ ] **4.6. RBAC Guard**: Gắn `@UseGuards(RolesGuard)` và gán role phù hợp cho từng route.
- [ ] **4.7. Swagger Docs**: Khai báo decorators Swagger đầy đủ.
- [ ] **4.8. API Test**: Test các cases qua Swagger UI: lấy trang 1, lọc tiêu cực, sort theo likes, bài không tồn tại.
