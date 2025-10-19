import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeedbackStatuses } from '@prisma/client';

/**
 * Request DTO — dùng khi cập nhật trạng thái feedback
 */
export class UpdateFeedbackStatusDto {
  @ApiProperty({
    enum: FeedbackStatuses,
    example: FeedbackStatuses.RESOLVED,
    description: 'New status of the feedback',
  })
  @IsEnum(FeedbackStatuses)
  status: FeedbackStatuses;

  @ApiProperty({
    example: 'Issue resolved successfully',
    required: false,
    description:
      'Optional message describing the reason or context of status change',
  })
  @IsOptional()
  @IsString()
  message?: string;
}

/**
 * Response DTO — trả về sau khi cập nhật trạng thái
 */
export class UpdateFeedbackStatusResponseDto {
  @ApiProperty({ example: 12, description: 'Unique ID of the feedback' })
  feedbackId: number;

  @ApiProperty({
    enum: FeedbackStatuses,
    example: FeedbackStatuses.RESOLVED,
    description: 'Updated status of the feedback',
  })
  currentStatus: FeedbackStatuses;

  @ApiProperty({
    example: '2025-10-18T12:45:00Z',
    description: 'Timestamp when the feedback status was updated (ISO8601)',
  })
  updatedAt: string;
}
