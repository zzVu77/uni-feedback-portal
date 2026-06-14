import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ToxicKeywordSortOption {
  KEYWORD = 'keyword',
  DATE = 'date',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryToxicKeywordDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, description: 'Current page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of keywords per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({
    enum: ToxicKeywordSortOption,
    description: 'Sort by name or date',
  })
  @IsOptional()
  @IsEnum(ToxicKeywordSortOption)
  orderBy?: ToxicKeywordSortOption;

  @ApiPropertyOptional({
    enum: SortDirection,
    description: 'Sort direction (asc or desc)',
  })
  @IsOptional()
  @IsEnum(SortDirection)
  orderDirection?: SortDirection;
}
