import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPostsDto {
  @ApiPropertyOptional({ example: 1, description: 'Page Number?' })
  @IsOptional()
  @Type(() => Number) // chuyển query string sang number
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Records per page?' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({ example: 2, description: 'Filter by category_id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id?: number;

  @ApiPropertyOptional({ example: 3, description: 'Filter by department_id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  department_id?: number;

  @ApiPropertyOptional({
    example: 'top',
    description: 'Sort by: "top" (votes) or default (new)',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'machine learning',
    description: 'Search by feedback subject',
  })
  @IsOptional()
  @IsString()
  q?: string;
}
