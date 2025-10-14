import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FeedbackStatuses } from '@prisma/client';

export class QueryMyFeedbacksDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
  @IsOptional() @IsEnum(FeedbackStatuses) status?: FeedbackStatuses;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) categoryId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) departmentId?: number;
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
  @IsOptional() @IsString() q?: string;
}
