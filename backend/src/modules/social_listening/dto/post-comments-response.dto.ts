import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostCommentItem {
  @ApiProperty({ description: 'ID nội bộ UUID của comment' })
  id: string;

  @ApiProperty({ description: 'Mã comment gốc trên Facebook' })
  commentId: string;

  @ApiProperty({ description: 'Mã bài viết' })
  postId: string;

  @ApiPropertyOptional({
    description: 'Mã comment cha nếu là bình luận trả lời (nested reply)',
  })
  parentCommentId: string | null;

  @ApiProperty({ description: 'Tên tác giả comment' })
  author: string;

  @ApiProperty({ description: 'Nội dung bình luận' })
  content: string;

  @ApiProperty({ description: 'Số lượt tương tác / reaction' })
  reactionCount: number;

  @ApiProperty({ description: 'Thời điểm đăng bình luận' })
  commentedAt: Date;

  @ApiProperty({
    description: 'Nhãn cảm xúc (Tiêu cực, Bức xúc, Trung lập, Tích cực)',
  })
  sentimentLabel: string;

  @ApiProperty({ description: 'Điểm cảm xúc từ -1.0 đến 1.0' })
  sentimentScore: number;

  @ApiProperty({
    description: 'Đánh dấu bình luận bức xúc hoặc bằng chứng tiêu biểu',
  })
  isTopConcern: boolean;

  @ApiProperty({ description: 'Thời điểm cào dữ liệu' })
  crawledAt: Date;
}

export class PostCommentsSentimentStats {
  @ApiProperty({ description: 'Số lượng comment tiêu cực' })
  negative: number;

  @ApiProperty({ description: 'Số lượng comment stress / lo âu / bức xúc' })
  stressAnxiety: number;

  @ApiProperty({ description: 'Số lượng comment trung lập' })
  neutral: number;

  @ApiProperty({ description: 'Số lượng comment tích cực' })
  positive: number;

  @ApiProperty({ description: 'Tỉ lệ phần trăm bình luận tiêu cực (%)' })
  negativeRatio: number;
}

export class PostCommentsPagination {
  @ApiProperty({ description: 'Trang hiện tại' })
  page: number;

  @ApiProperty({ description: 'Số lượng mỗi trang' })
  limit: number;

  @ApiProperty({ description: 'Tổng số trang' })
  totalPages: number;

  @ApiProperty({ description: 'Tổng số bản ghi thỏa điều kiện lọc' })
  totalRecords: number;
}

export class PostCommentsOverviewInfo {
  @ApiPropertyOptional({ description: 'Đường dẫn bài viết trên Facebook' })
  postLink: string | null;

  @ApiProperty({ description: 'Trạng thái đã cào bình luận hay chưa' })
  isCommentsCrawled: boolean;

  @ApiPropertyOptional({
    description: 'Tóm tắt tổng quan phản ứng dư luận do AI tổng hợp',
  })
  commentsAiSummary: string | null;

  @ApiPropertyOptional({ description: 'Tỉ lệ tiêu cực của bài viết' })
  negativeCommentsRatio: number | null;

  @ApiPropertyOptional({
    description: 'Mức độ cấp bách: NORMAL, WARNING, CRITICAL',
  })
  urgencyLevel: string | null;
}

export class PostCommentsResponseDto {
  @ApiProperty({ description: 'Mã bài viết' })
  postId: string;

  @ApiProperty({
    description: 'Thông tin tổng hợp của bài viết',
    type: PostCommentsOverviewInfo,
  })
  postInfo: PostCommentsOverviewInfo;

  @ApiProperty({ description: 'Tổng số bình luận của bài viết' })
  totalComments: number;

  @ApiProperty({ description: 'Số bình luận sau khi áp dụng bộ lọc' })
  filteredComments: number;

  @ApiProperty({
    description: 'Thống kê cảm xúc bình luận',
    type: PostCommentsSentimentStats,
  })
  sentimentStats: PostCommentsSentimentStats;

  @ApiProperty({ description: 'Danh sách bình luận', type: [PostCommentItem] })
  comments: PostCommentItem[];

  @ApiProperty({
    description: 'Thông tin phân trang',
    type: PostCommentsPagination,
  })
  pagination: PostCommentsPagination;
}
