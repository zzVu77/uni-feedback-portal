import { ApiPropertyOptional } from '@nestjs/swagger';
import { FeedbackStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';

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
    enum: FeedbackStatus,
    example: 'PENDING',
    description: 'Filter by feedback status',
  })
  @IsOptional()
  // @IsEnum(FeedbackStatus)
  status?: FeedbackStatus;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440006',
    description: 'Filter by category ID',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'Filter by department ID',
  })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Filter feedbacks created after this date (ISO8601 format)',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
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
