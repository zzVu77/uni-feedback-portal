import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class GenerateUploadUrlDto {
  @ApiProperty({
    example: 'screenshot.png',
    description: 'The name of the file to be uploaded.',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    example: 'image/png',
    description: 'The MIME type of the file.',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['image/png', 'image/jpeg', 'application/pdf'], {
    message: 'File type is not allowed',
  })
  fileType: string;

  @ApiProperty({
    example: 245678,
    description: 'File size in bytes.',
  })
  @IsInt()
  @Min(1)
  @Max(5 * 1024 * 1024, {
    message: 'File size must be less than 5MB',
  })
  fileSize: number;
}
export class GenerateUploadUrlResponseDto {
  @ApiProperty({
    description:
      'The pre-signed URL to be used by the client for a PUT request to upload the file directly to S3.',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'The final public URL of the file after it has been uploaded.',
  })
  fileUrl: string;
}

export class DeleteFileDto {
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;
}
