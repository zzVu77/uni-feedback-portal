import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FeedbackStatuses } from '@prisma/client';

export class SearchMyFeedbacksDto {
  @IsString() q: string;
  @IsOptional() @IsEnum(FeedbackStatuses) status?: FeedbackStatuses;
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) categoryId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) departmentId?: number;
}
