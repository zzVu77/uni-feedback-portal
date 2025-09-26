import { ApiProperty } from '@nestjs/swagger';

export class CommentUserDto {
  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: 'Nguyen Van A' })
  full_name: string;

  @ApiProperty({ example: 'student' })
  role: string;
}

export class QueryCommentsResponseDto {
  @ApiProperty({ example: 1 })
  comment_id: number;

  @ApiProperty({ example: 'This is a comment' })
  content: string;

  @ApiProperty({ example: '2025-09-26T09:30:00.000Z' })
  created_at: string;

  @ApiProperty({ type: () => CommentUserDto })
  user: CommentUserDto;
}
