import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  // IsUUID,
  IsString,
} from 'class-validator';
import { NotificationType } from '@prisma/client';

export class UpdateNotificationsDto {
  @ApiPropertyOptional({
    description: 'Array of notification IDs to update',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];

  @ApiPropertyOptional({
    description:
      'Apply the update to all notifications instead of specific IDs',
  })
  @IsOptional()
  @IsBoolean()
  all?: boolean;

  @ApiPropertyOptional({
    description: 'Filter notifications by type (can be multiple)',
    enum: NotificationType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(NotificationType, { each: true })
  type?: NotificationType[];

  @ApiPropertyOptional({ description: 'Mark notifications as read/unread' })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
