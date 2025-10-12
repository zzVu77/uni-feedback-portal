import { ApiProperty } from '@nestjs/swagger';

export class PostItemDto {
  @ApiProperty({ example: 1 })
  post_id: number;

  @ApiProperty({ example: 5 })
  feedback_id: number;

  @ApiProperty({ example: 'How to learn AI fast?' })
  subject: string;

  @ApiProperty({ example: 'This is a sample description...' })
  excerpt: string;

  @ApiProperty({ example: 2 })
  category_id: number;

  @ApiProperty({ example: 3 })
  department_id: number;

  @ApiProperty({ example: 10, description: 'Số comment' })
  comments_count: number;

  @ApiProperty({ example: 25, description: 'Số vote' })
  votes: number;

  @ApiProperty({ example: '2025-09-24T12:34:56.000Z' })
  created_at: Date;
}

export class GetPostsResponseDto {
  @ApiProperty({ type: [PostItemDto] })
  results: PostItemDto[];
  @ApiProperty({
    example: 100,
    description: 'Tổng số post thỏa điều kiện (dùng cho pagination)',
  })
  total: number;
}
