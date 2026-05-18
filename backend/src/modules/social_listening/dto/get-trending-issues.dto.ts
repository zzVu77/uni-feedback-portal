// src/modules/social_listening/dto/get-trending-issues.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  Min,
  IsOptional,
  IsString,
} from 'class-validator';

// Export type này để Frontend có thể sử dụng lại nếu cần
export enum SentimentLabel {
  NEGATIVE = 'Tiêu cực',
  NEUTRAL = 'Trung lập',
  POSITIVE = 'Tích cực',
  NO_DATA = 'Chưa có dữ liệu',
}

export class GetTrendingIssuesDto {
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

  @ApiPropertyOptional({
    description: 'Filter by postedAt >= startDate (ISO8601)',
  })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by postedAt < endDate + 1 day (ISO8601)',
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ enum: SentimentLabel })
  @IsOptional()
  @IsEnum(SentimentLabel)
  sentimentLabel?: SentimentLabel;
}
