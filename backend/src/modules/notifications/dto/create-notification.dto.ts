import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationsDto {
  @ApiProperty({
    description: 'The IDs of the recipients of the notification',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
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

  @ApiProperty({ description: 'The ID of the related entity' })
  @IsString()
  targetId: string | null;

  @ApiProperty({ description: 'The title of the related entity' })
  @IsString()
  title: string;
}
