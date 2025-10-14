import { ApiProperty } from '@nestjs/swagger';
export class FeedbackDto {
  @ApiProperty({
    description: 'Unique identifier of the feedback',
    example: 555,
  })
  feedbackId: number;

  @ApiProperty({
    description: 'Subject or title of the feedback',
    example: 'Improve WiFi in the dormitory',
  })
  subject: string;

  @ApiProperty({
    description: 'Detailed description of the feedback',
    example: 'WiFi connection is often unstable in the evening.',
  })
  description: string;

  @ApiProperty({
    description: 'Category identifier related to the feedback',
    example: 3,
  })
  categoryId: number;

  @ApiProperty({
    description: 'Department identifier that receives the feedback',
    example: 2,
  })
  departmentId: number;

  @ApiProperty({
    description: 'Current status of feedback',
    example: 'PENDING',
  })
  currentStatus: string;
}

export class GetPostResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: 123,
  })
  postId: number;

  @ApiProperty({
    description: 'Timestamp when the post was created (ISO string)',
    example: '2025-09-26T08:45:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Feedback information attached to this post',
    type: FeedbackDto,
  })
  feedback: FeedbackDto;

  @ApiProperty({
    description: 'Total number of votes',
    example: 87,
  })
  votes: number;

  @ApiProperty({
    description: 'Indicates whether the current user has voted',
    example: true,
  })
  hasVoted: boolean;
}

export class PostItemDto {
  @ApiProperty({ example: 1 })
  postId: number;

  @ApiProperty({ example: 'How to learn AI fast?' })
  subject: string;

  @ApiProperty({ example: 'This is a sample description...' })
  excerpt: string;

  @ApiProperty({ example: 2 })
  categoryId: number;

  @ApiProperty({ example: 3 })
  departmentId: number;

  @ApiProperty({ example: 'PENDING' })
  currentStatus: string;

  @ApiProperty({ example: 10 })
  commentsCount: number;

  @ApiProperty({ example: 25 })
  votes: number;

  @ApiProperty({ example: true })
  hasVoted: boolean;

  @ApiProperty({ example: '2025-09-24T12:34:56.000Z' })
  createdAt: Date;
}

export class GetPostsResponseDto {
  @ApiProperty({ type: [PostItemDto] })
  results: PostItemDto[];
  @ApiProperty({
    example: 100,
    description: 'Total post for pagination',
  })
  total: number;
}
