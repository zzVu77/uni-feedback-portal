import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPostsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) category_id?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) department_id?: number;
  @IsOptional() @IsIn(['new', 'top']) sortBy?: 'new' | 'top';
  @IsOptional() @IsString() q?: string;
}
