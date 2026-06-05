import { ApiPropertyOptional } from '@nestjs/swagger';
import { DataSourceStatus, Platform } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QuerySocialDataSourceDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search by group name or url' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ enum: DataSourceStatus })
  @IsOptional()
  @IsEnum(DataSourceStatus)
  status?: DataSourceStatus;

  @ApiPropertyOptional({ enum: Platform })
  @IsOptional()
  @IsEnum(Platform)
  platform?: Platform;
}
