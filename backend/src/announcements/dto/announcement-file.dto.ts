import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementFileDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'document.pdf' })
  fileName: string;

  @ApiProperty({ example: 'https://example.com/files/document.pdf' })
  fileUrl: string;
}
