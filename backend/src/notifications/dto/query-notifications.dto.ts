import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationTypes } from '@prisma/client';

export class QueryNotificationsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) pageSize?: number;
  @IsOptional() @IsEnum(NotificationTypes) type?: NotificationTypes;
  @IsOptional() @IsBooleanString() isRead?: string;
  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
}
