import { ApiProperty } from '@nestjs/swagger';
import {
  FeedbackSummary,
  FeedbackDetail,
} from '../../feedbacks/dto/feedback-response.dto';
import { FeedbackStatus } from '@prisma/client';

class StudentInfo {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-44665544001c' })
  id: string;

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
  results: (FeedbackSummary & { student?: StudentInfo })[];

  @ApiProperty({ example: 42, description: 'Total number of feedbacks' })
  total: number;
}

class ForumPost {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-44665544001c' })
  id: string;
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
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-44665544001c' })
  id: string;

  @ApiProperty({ example: 'IT Department' })
  name: string;
}

export class ForwardingResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-44665544001c' })
  forwardingLogId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-44665544001c' })
  feedbackId: string;

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
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-44665544001c',
    description: 'Unique ID of the feedback',
  })
  feedbackId: string;

  @ApiProperty({
    enum: FeedbackStatus,
    example: FeedbackStatus.RESOLVED,
    description: 'Updated status of the feedback',
  })
  currentStatus: FeedbackStatus;

  @ApiProperty({
    example: '2025-10-18T12:45:00Z',
    description: 'Timestamp when the feedback status was updated (ISO8601)',
  })
  updatedAt: string;
}
