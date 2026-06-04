import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Platform } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateSocialDataSourceDto {
  @ApiProperty({ description: 'The unique URL of the data source' })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Display name of the group or source' })
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @ApiProperty({
    enum: Platform,
    description: 'The platform (e.g., FACEBOOK, REDDIT)',
  })
  @IsNotEmpty()
  @IsEnum(Platform)
  platform: Platform;

  @ApiPropertyOptional({
    description: 'Optional description or note for admins',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
