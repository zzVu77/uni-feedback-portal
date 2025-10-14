import { ApiProperty } from '@nestjs/swagger';

export class PostItemDto {
  @ApiProperty({ example: 1 })
  postId: number;

  @ApiProperty({ example: 5 })
  feedbackId: number;

  @ApiProperty({ example: 'How to learn AI fast?' })
  subject: string;

  @ApiProperty({ example: 'This is a sample description...' })
  excerpt: string;

  @ApiProperty({ example: 2 })
  categoryId: number;

  @ApiProperty({ example: 3 })
  departmentId: number;

  @ApiProperty({ example: 10, description: 'Comment Total' })
  commentsCount: number;

  @ApiProperty({ example: 25, description: 'Vote Total' })
  votes: number;

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
