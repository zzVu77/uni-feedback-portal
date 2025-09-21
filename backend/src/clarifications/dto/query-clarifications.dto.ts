import { IsBooleanString, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryClarificationsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) feedback_id?: number;
  @IsOptional() @IsBooleanString() is_closed?: string; // 'true' | 'false'
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
}
