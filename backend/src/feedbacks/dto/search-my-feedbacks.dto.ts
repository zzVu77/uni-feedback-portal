import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeedbackStatuses } from '@prisma/client';

export class SearchMyFeedbacksDto {
  @ApiProperty({
    description: 'Keyword to search in feedback titles or content',
    example: 'UI bug',
  })
  @IsString()
  q: string;

  @ApiPropertyOptional({
    description: 'Filter feedbacks by their current status',
    enum: FeedbackStatuses,
    example: FeedbackStatuses.PENDING,
  })
  @IsOptional()
  @IsEnum(FeedbackStatuses)
  status?: FeedbackStatuses;

  @ApiPropertyOptional({
    description: 'Filter feedbacks created after this date (ISO 8601 format)',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter feedbacks created before this date (ISO 8601 format)',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({
    description: 'Filter feedbacks by category ID',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Filter feedbacks by department ID',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  departmentId?: number;
}
