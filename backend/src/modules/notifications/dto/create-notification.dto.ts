import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsArray,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationsDto {
  @ApiProperty({
    description: 'The IDs of the recipients of the notification',
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  @IsNotEmpty({ each: true })
  userIds?: string[];

  @ApiProperty({ description: 'The content of the notification' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The type of the notification',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ description: 'The ID related to the notification' })
  @IsUUID()
  targetId?: string;
}
