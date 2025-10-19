import { ApiProperty } from '@nestjs/swagger';
import {
  FeedbackSummary,
  FeedbackDetail,
} from '../../feedbacks/dto/feedback-response.dto';
import { FeedbackStatuses } from '@prisma/client';

class StudentInfo {
  @ApiProperty({ example: 12 })
  userId: number;

  @ApiProperty({ example: 'Nguyen Van A', nullable: true })
  fullName: string | null;

  @ApiProperty({ example: 'a@student.edu.vn' })
  email: string;
}

export class ListFeedbacksResponseDto {
  @ApiProperty({
    type: () => [FeedbackSummary],
    description: 'List of feedbacks with optional student info',
  })
  items: (FeedbackSummary & { student?: StudentInfo })[];

  @ApiProperty({ example: 42, description: 'Total number of feedbacks' })
  total: number;
}

class ForumPost {
  @ApiProperty({ example: 101 })
  postId: number;
}

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
    description: 'Information about the department that forwarded the feedback',
  })
  fromDepartment: DepartmentInfo;

  @ApiProperty({
    type: DepartmentInfo,
    description:
      'Information about the department receiving the forwarded feedback',
  })
  toDepartment: DepartmentInfo;

  @ApiProperty({ example: 'This feedback needs to be handled urgently.' })
  message?: string;

  @ApiProperty({ example: '2025-10-18T10:30:00.000Z' })
  createdAt: string;
}
export class UpdateFeedbackStatusResponseDto {
  @ApiProperty({ example: 12, description: 'Unique ID of the feedback' })
  feedbackId: number;

  @ApiProperty({
    enum: FeedbackStatuses,
    example: FeedbackStatuses.RESOLVED,
    description: 'Updated status of the feedback',
  })
  currentStatus: FeedbackStatuses;

  @ApiProperty({
    example: '2025-10-18T12:45:00Z',
    description: 'Timestamp when the feedback status was updated (ISO8601)',
  })
  updatedAt: string;
}
