import { ApiProperty } from '@nestjs/swagger';
import {
  FeedbackSummary,
  FeedbackDetail,
} from '../../feedbacks/dto/feedback-response.dto';

// Thông tin sinh viên
class StudentInfo {
  @ApiProperty({ example: 12 })
  userId: number;

  @ApiProperty({ example: 'Nguyen Van A', nullable: true })
  fullName: string | null;

  @ApiProperty({ example: 'a@student.edu.vn' })
  email: string;
}

// Dùng cho danh sách feedback
export class ListFeedbacksResponseDto {
  @ApiProperty({
    type: () => [FeedbackSummary],
    description: 'List of feedbacks with optional student info',
  })
  items: (FeedbackSummary & { student?: StudentInfo })[];

  @ApiProperty({ example: 42, description: 'Total number of feedbacks' })
  total: number;
}

// Bài đăng liên kết với feedback (ví dụ forum post)
class ForumPost {
  @ApiProperty({ example: 101 })
  postId: number;
}

// Feedback chi tiết (gồm forumPost và student)
export class FeedbackDetailDto extends FeedbackDetail {
  @ApiProperty({
    type: () => StudentInfo,
    required: false,
    nullable: true,
    description: 'Information about the student who submitted this feedback',
  })
  student?: StudentInfo;

  @ApiProperty({
    type: () => ForumPost,
    required: false,
    nullable: true,
    description: 'Forum post associated with this feedback (if any)',
  })
  forumPost?: ForumPost;
}
