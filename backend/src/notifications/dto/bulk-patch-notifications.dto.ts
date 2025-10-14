import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { NotificationTypes } from '@prisma/client';

export class BulkPatchNotificationsDto {
  @IsOptional() @IsArray() ids?: number[];
  @IsOptional() @IsBoolean() all?: boolean;
  @IsOptional() @IsEnum(NotificationTypes) type?: NotificationTypes;
}
