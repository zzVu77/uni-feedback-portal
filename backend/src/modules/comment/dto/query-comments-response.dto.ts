import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  fullName: string;

  @ApiProperty({ example: 'student' })
  role: string;
}

export class CommentDto {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'This is a comment' })
  content: string;

  @ApiProperty({ example: '2025-09-26T09:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ type: () => UserInfo })
  user: UserInfo;
}

export class CommentsResponseDto {
  @ApiProperty({ type: [CommentDto] })
  results: CommentDto[];

  @ApiProperty({ example: 50 })
  total: number;
}
