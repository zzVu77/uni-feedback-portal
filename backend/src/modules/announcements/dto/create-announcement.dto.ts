import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnouncementFileDto } from './announcement-file.dto';

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'Title of the announcement (minimum 3 characters)',
    example: 'System Maintenance Notification',
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description:
      'Content or message body of the announcement (minimum 3 characters)',
    example:
      'The system will be down for maintenance on October 25 from 2 AM to 4 AM.',
  })
  @IsString()
  @MinLength(3)
  content: string;

  @ApiPropertyOptional({
    description: 'List of files attached to the announcement (optional)',
    type: [AnnouncementFileDto],
    example: [
      {
        fileName: 'schedule.pdf',
        fileUrl: 'https://example.com/files/schedule.pdf',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnouncementFileDto)
  files?: AnnouncementFileDto[];
}
