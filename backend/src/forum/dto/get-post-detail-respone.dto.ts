import { ApiProperty } from '@nestjs/swagger';

export class FeedbackDto {
  @ApiProperty({
    description: 'Unique identifier of the feedback',
    example: 555,
  })
  feedback_id: number;

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
  category_id: number;

  @ApiProperty({
    description: 'Department identifier that receives the feedback',
    example: 2,
  })
  department_id: number;
}

export class GetPostResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: 123,
  })
  post_id: number;

  @ApiProperty({
    description: 'Timestamp when the post was created (ISO string)',
    example: '2025-09-26T08:45:00.000Z',
  })
  created_at: string;

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
