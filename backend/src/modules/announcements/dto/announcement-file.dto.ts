import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AnnouncementFileDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'document.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'https://example.com/files/document.pdf' })
  @IsString()
  fileUrl: string;
}
