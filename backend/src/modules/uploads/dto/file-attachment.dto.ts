import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class FileAttachmentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-44665544004a',
    description: 'Unique ID of the file attachment',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'projector_issue.jpg',
    description: 'Original name of the uploaded file',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    example: 'https://example.com/files/projector_issue.jpg',
    description: 'Publicly accessible URL of the file',
  })
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'MIME type of the file',
  })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty({
    example: 350000,
    description: 'Size of the file in bytes',
  })
  @IsInt()
  fileSize: number;
}
