import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FeedbackStatus } from '@prisma/client';

export class QueryManageFeedbacksDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
  @IsOptional() @IsEnum(FeedbackStatus) status?: FeedbackStatus;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) category_id?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) department_id?: number;
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
  @IsOptional() @IsString() q?: string;
}
