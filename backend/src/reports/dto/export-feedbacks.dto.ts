import { IsEnum, IsInt, IsISO8601, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { FeedbackStatuses } from '@prisma/client';

export class ExportFeedbacksDto {
  @IsEnum(['csv', 'xlsx', 'pdf'] as const) // use custom pipe in controller if needed
  format: 'csv' | 'xlsx' | 'pdf';

  @IsOptional() @IsEnum(FeedbackStatuses) status?: FeedbackStatuses;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) departmentId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) categoryId?: number;
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
}
