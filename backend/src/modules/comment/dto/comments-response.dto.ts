import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';

export class UserInfo {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  fullName: string;

  @ApiProperty({ example: 'student' })
  role?: string;
}
export class PostInfo {
  @ApiProperty({ example: 'a84b6d12-9c31-43a1-bc24-958b08f2b92c' })
  id: string;

  @ApiProperty({ example: 'Broken Air Conditioner in Room 302' })
  subject: string;

  @ApiProperty({ example: 'The AC in the classroom is not working properly.' })
  description: string;
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
  deletedAt?: string | null;
  @ApiProperty({ example: null, nullable: true })
  parentId?: string | null;

  @ApiProperty({ type: () => [CommentDto], required: false })
  replies?: CommentDto[];
}
export class CommentForReportDto extends OmitType(CommentDto, [
  'replies',
  'parentId',
] as const) {
  @ApiProperty({ type: () => PostInfo, required: false })
  post?: PostInfo;
}
export class CommentsResponseDto {
  @ApiProperty({ type: [CommentDto] })
  results: CommentDto[];

  @ApiProperty({ example: 50 })
  total: number;
}

export class CommentReportDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => UserInfo })
  reportedBy: UserInfo;

  @ApiProperty({ type: () => CommentForReportDto })
  comment: CommentForReportDto;

  @ApiProperty()
  reason?: string | null;

  @ApiProperty({ enum: ReportStatus })
  status: ReportStatus;

  @ApiProperty()
  adminResponse?: string | null;

  @ApiProperty()
  createdAt: string;
}
export class CommentReportResponseDto {
  @ApiProperty({ type: () => [CommentReportDto] })
  results: CommentReportDto[];
  @ApiProperty({ example: 50 })
  total: number;
}
