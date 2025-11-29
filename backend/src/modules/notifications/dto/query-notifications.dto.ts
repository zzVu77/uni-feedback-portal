import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsISO8601, IsOptional, Min } from 'class-validator';

export class QueryNotificationsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Filter by notification type',
    enum: ['ALL', 'FORUM', 'FEEDBACK', 'VIOLATION'],
    default: 'ALL',
  })
  @IsOptional()
  // @IsEnum(['ALL', 'FORUM', 'FEEDBACK', 'VIOLATION'])
  type?: GroupNotiFilter;

  @ApiPropertyOptional({ description: 'Filter by read status' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({ description: 'Filter from date (ISO8601)' })
  @IsOptional()
  @Type(() => Date)
  @IsISO8601()
  from?: Date;

  @ApiPropertyOptional({ description: 'Filter to date (ISO8601)' })
  @IsOptional()
  @Type(() => Date)
  @IsISO8601()
  to?: Date;
}

export type GroupNotiFilter = 'ALL' | 'FORUM' | 'FEEDBACK' | 'VIOLATION';
