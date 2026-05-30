import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPostsDto {
  @ApiPropertyOptional({ example: 1, description: 'Page Number?' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Records per page?' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440004',
    description: 'Filter by categoryId',
  })
  @IsOptional()
  @IsUUID('loose')
  categoryId?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filter by departmentId',
  })
  @IsOptional()
  @IsUUID('loose')
  departmentId?: string;

  @ApiPropertyOptional({
    example: 'top',
    description: 'Sort by: "top" (votes) or default (new)',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Filter feedbacks created after this date (ISO8601 format)',
  })
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
    example: 'machine learning',
    description: 'Search by feedback subject',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
