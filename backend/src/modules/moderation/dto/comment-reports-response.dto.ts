import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CommentTargetType, ReportStatus } from '@prisma/client';
import { CommentDto, UserInfo } from 'src/modules/comment/dto';

export class CommentTargetInfoDto {
  @ApiProperty({
    example: 'a84b6d12-9c31-43a1-bc24-958b08f2b92c',
    description:
      'Unique identifier of the target (Forum Post or Announcement).',
  })
  id: string;

  @ApiProperty({
    example: 'Broken Air Conditioner in Room 302',
    description: 'Title or subject of the target.',
  })
  title: string;

  @ApiProperty({
    example: 'The AC in the classroom is not working properly.',
    description: 'Content or description of the target.',
  })
  content: string;
}

export class CommentForModerationDto extends OmitType(CommentDto, [
  'replies',
  'parentId',
] as const) {
  @ApiProperty({
    example: '2025-10-29T10:30:00.000Z',
    description:
      'Timestamp indicating when the comment was deleted, or null if active.',
  })
  deletedAt: string | null;
}
export class ReportTargetDto {
  @ApiProperty({
    enum: CommentTargetType,
    example: CommentTargetType.FORUM_POST,
    description: 'The target type the comment belongs to',
  })
  targetType: CommentTargetType;

  @ApiProperty({
    type: () => CommentTargetInfoDto,
    description: 'Target details (Post or Announcement).',
  })
  targetInfo: CommentTargetInfoDto;
}
export class CommentReportDto {
  @ApiProperty({
    example: 'd4b5f3a8-83e9-4c11-b3b9-912dbed11f71',
    description: 'Unique identifier of the comment report.',
  })
  id: string;

  @ApiProperty({
    type: () => UserInfo,
    description: 'Information about the user who reported the comment.',
  })
  reportedBy: UserInfo;

  @ApiProperty({
    type: () => CommentForModerationDto,
    description: 'Details of the reported comment.',
  })
  comment: CommentForModerationDto;
  @ApiProperty({
    type: () => ReportTargetDto,
    description:
      'Information about the context (Post/Announcement) where the comment was made.',
  })
  target: ReportTargetDto;
  @ApiProperty({
    example: 'Inappropriate language used.',
    description: 'Reason provided by the user for reporting the comment.',
    required: false,
  })
  reason?: string | null;

  @ApiProperty({
    enum: ReportStatus,
    example: ReportStatus.PENDING,
    description: 'Current moderation status of the report.',
  })
  status: ReportStatus;

  @ApiProperty({
    example: 'Reviewed and action taken.',
    description: 'Response from the admin regarding the report.',
    required: false,
  })
  adminResponse?: string | null;

  @ApiProperty({
    example: '2025-10-29T09:30:00.000Z',
    description: 'Timestamp when the report was created.',
  })
  createdAt: string;
}

export class CommentReportResponseDto {
  @ApiProperty({
    type: () => [CommentReportDto],
    description: 'List of comment reports returned from the moderation query.',
  })
  results: CommentReportDto[];

  @ApiProperty({
    example: 50,
    description: 'Total number of comment reports found.',
  })
  total: number;
}
