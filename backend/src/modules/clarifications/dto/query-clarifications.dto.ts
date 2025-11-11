import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryClarificationsDto {
  @ApiPropertyOptional({
    description: 'Filter conversations by feedback ID.',
    example: '550e8400-e29b-41d4-a716-446655440013',
  })
  @IsOptional()
  @IsString()
  feedbackId?: string;

  @ApiPropertyOptional({
    description:
      "Filter conversations by their closed status ('true' or 'false').",
    example: 'false',
  })
  @IsOptional()
  @IsBooleanString()
  isClosed?: string;

  @ApiPropertyOptional({
    description: 'The page number for pagination.',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'The number of items per page.',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}
