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

class DepartmentInfo {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'IT Department' })
  name: string;
}

export class ForwardingResponseDto {
  @ApiProperty({ example: 101 })
  forwardingLogId: number;

  @ApiProperty({ example: 15 })
  feedbackId: number;

  @ApiProperty({
    type: DepartmentInfo,
    description: 'Thông tin phòng ban gửi',
  })
  fromDepartment: DepartmentInfo;

  @ApiProperty({
    type: DepartmentInfo,
    description: 'Thông tin phòng ban nhận',
  })
  toDepartment: DepartmentInfo;

  @ApiProperty({ example: 'Phản hồi này cần được xử lý sớm.' })
  message?: string;

  @ApiProperty({ example: '2025-10-18T10:30:00.000Z' })
  createdAt: string;
}
