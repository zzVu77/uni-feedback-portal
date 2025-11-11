import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeedbackStatus } from '@prisma/client';

export class UpdateFeedbackStatusDto {
  @ApiProperty({
    enum: FeedbackStatus,
    example: FeedbackStatus.RESOLVED,
    description: 'New status of the feedback',
  })
  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;

  @ApiProperty({
    example: 'Additional note regarding the status update',
    required: false,
    description:
      'Optional note providing extra information about the status update',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
