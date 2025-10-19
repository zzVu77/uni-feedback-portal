import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeedbackStatuses } from '@prisma/client';

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
