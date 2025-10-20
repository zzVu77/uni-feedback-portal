import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FeedbackStatuses } from '@prisma/client';

export class QueryFeedbacksDto {
  @ApiPropertyOptional({ example: 1, description: 'Current page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of feedbacks per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({
    enum: FeedbackStatuses,
    example: 'PENDING',
    description: 'Filter by feedback status',
  })
  @IsOptional()
  @IsEnum(FeedbackStatuses)
  status?: FeedbackStatuses;

  @ApiPropertyOptional({ example: 2, description: 'Filter by category ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Filter by department ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  departmentId?: number;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter feedbacks created after this date (ISO8601 format)',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Filter feedbacks created before this date (ISO8601 format)',
  })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({
    example: 'login issue',
    description: 'Search keyword in feedback subject or description',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
