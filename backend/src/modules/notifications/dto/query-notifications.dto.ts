/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsISO8601, IsOptional, Min } from 'class-validator';
export enum GroupNotiFilterEnum {
  ALL = 'ALL',
  FORUM = 'FORUM',
  FEEDBACK = 'FEEDBACK',
  VIOLATION = 'VIOLATION',
}
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
  @Transform(({ value }): string => (value ? value.toUpperCase() : value))
  @IsEnum(GroupNotiFilterEnum)
  type?: GroupNotiFilter;

  @ApiPropertyOptional({ description: 'Filter by read status' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'all') return undefined;
    return value;
  })
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
