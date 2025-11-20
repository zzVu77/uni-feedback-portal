import { ApiProperty } from '@nestjs/swagger';

export class FileAttachmentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  fileUrl: string;

  @ApiProperty()
  fileType: string;

  @ApiProperty()
  fileSize: number;
}
