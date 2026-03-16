import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
  IsUUID,
} from 'class-validator';
// GENERAL CONSTANTS
export const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class BaseFileItemDto {
  @ApiProperty({ example: 'screenshot.png' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_FILE_TYPES, { message: 'File type is not allowed' })
  fileType: string;

  @ApiProperty({ example: 350000 })
  @IsInt()
  @Min(1)
  @Max(MAX_FILE_SIZE, { message: 'File size must be less than 5MB' })
  fileSize: number;
}

export class FileAttachmentDto extends BaseFileItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-44665544004a',
    description: 'Unique ID of the file attachment',
  })
  @IsUUID('loose')
  id: string;

  @ApiProperty({
    example: 'projector_issue.jpg',
    description: 'The key of the file in the storage',
  })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiProperty({
    example: 'https://example.com/files/projector_issue.jpg',
    description: 'Publicly accessible URL of the file',
  })
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;
}
