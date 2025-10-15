import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeedbackStatuses } from '@prisma/client';

export class QueryMyFeedbacksDto {
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

export class FeedbackSummary {
  @ApiProperty({ example: 101, description: 'Unique ID of the feedback' })
  feedbackId: number;

  @ApiProperty({
    example: 'Cannot log in to the system',
    description: 'Feedback subject',
  })
  subject: string;

  @ApiProperty({
    example: 'IN_PROGRESS',
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
    description: 'Current status of the feedback',
  })
  currentStatus: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

  @ApiProperty({
    example: false,
    description: 'Indicates if feedback is private',
  })
  isPrivate: boolean;

  @ApiProperty({
    example: 3,
    description: 'Department ID responsible for the feedback',
  })
  departmentId: number;

  @ApiProperty({ example: 2, description: 'Category ID of the feedback' })
  categoryId: number;

  @ApiProperty({
    example: '2025-10-15T10:00:00Z',
    description: 'Date and time when the feedback was created',
  })
  createdAt: string;
}

export class GetMyFeedbacksResponseDto {
  @ApiProperty({
    type: [FeedbackSummary],
    description: 'List of feedbacks submitted by the user',
  })
  items: FeedbackSummary[];

  @ApiProperty({ example: 45, description: 'Total number of feedbacks found' })
  total: number;
}
