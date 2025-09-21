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

export class SearchMyFeedbacksDto {
  @IsString() q: string;
  @IsOptional() @IsEnum(FeedbackStatus) status?: FeedbackStatus;
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) category_id?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) department_id?: number;
}
