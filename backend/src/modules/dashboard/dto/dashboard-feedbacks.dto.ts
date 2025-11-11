import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, Min } from 'class-validator';

export class DashboardFeedbacksDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) department_id?: number;
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
}
