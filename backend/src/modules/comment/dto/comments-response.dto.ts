import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  fullName: string;

  @ApiProperty({ example: 'STUDENT' })
  role?: string;
}

export class CommentDto {
  @ApiProperty({ example: 'a84b6d12-9c31-43a1-bc24-958b08f2b92c' })
  id: string;

  @ApiProperty({ example: 'This is a comment' })
  content: string;

  @ApiProperty({ example: '2025-09-26T09:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ type: () => UserInfo })
  user: UserInfo;

  @ApiProperty({ example: null, nullable: true })
  parentId?: string | null;
  @ApiProperty({ type: () => [CommentDto], required: false })
  replies?: CommentDto[];
}

export class CommentsResponseDto {
  @ApiProperty({ type: [CommentDto] })
  results: CommentDto[];

  @ApiProperty({ example: 50 })
  total: number;
}
export class CommentDeletedResponseDto extends OmitType(CommentDto, [
  'replies',
  'parentId',
] as const) {
  @ApiProperty({ example: '2025-10-29T10:30:00.000Z' })
  deletedAt: string;
}
