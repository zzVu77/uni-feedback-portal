import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FeedbackStatus } from '@prisma/client';

export class UpdateFeedbackStatusDto {
  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;

  @IsOptional()
  @IsString()
  message?: string;
}
