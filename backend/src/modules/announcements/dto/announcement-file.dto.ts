import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AnnouncementFileDto {
  @ApiProperty({ example: 'document.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'https://example.com/files/document.pdf' })
  @IsString()
  fileUrl: string;
}
