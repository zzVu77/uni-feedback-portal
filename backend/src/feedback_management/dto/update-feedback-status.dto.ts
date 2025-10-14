import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeedbackStatuses } from '@prisma/client';

export class UpdateFeedbackStatusDto {
  @IsEnum(FeedbackStatuses)
  status: FeedbackStatuses;

  @IsOptional()
  @IsString()
  message?: string;
}
