import { ApiProperty } from '@nestjs/swagger';
export class FeedbackDto {
  @ApiProperty({
    description: 'Unique identifier of the feedback',
    example: '555e8400-e29b-41d4-a716-446655440009',
  })
  id: string;

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
    example: '550e8400-e29b-41d4-a716-446655440009',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Department identifier that receives the feedback',
    example: '550e8400-e29b-41d4-a716-446655440009',
  })
  departmentId: string;

  @ApiProperty({
    description: 'Current status of feedback',
    example: 'PENDING',
  })
  @ApiProperty({
    description: 'Current status of feedback',
    example: 'PENDING',
  })
  currentStatus: string;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '550e8400-e29b-41d4-a716-446655440009',
  })
  id: string;

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
  @ApiProperty({ example: '150e8400-e29b-41d4-a716-446655440009' })
  id: string;

  @ApiProperty({ example: 'How to learn AI fast?' })
  subject: string;

  @ApiProperty({ example: 'This is a sample description...' })
  excerpt: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  categoryId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  departmentId: string;

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
