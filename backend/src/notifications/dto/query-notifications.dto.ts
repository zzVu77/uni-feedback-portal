import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '@prisma/client';

export class QueryNotificationsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
  @IsOptional() @IsEnum(NotificationType) type?: NotificationType;
  @IsOptional() @IsBooleanString() is_read?: string;
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
}
