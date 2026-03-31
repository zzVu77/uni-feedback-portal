import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseFileItemDto } from './file-attachment.dto';
import { FileTargetType } from '@prisma/client';

export class GenerateUploadUrlDto extends BaseFileItemDto {
  @ApiProperty({ example: 'FEEDBACK', enum: FileTargetType })
  @IsEnum(FileTargetType)
  @IsNotEmpty()
  targetType: FileTargetType;

  // @ApiProperty({ example: 'uuid-of-the-feedback' })
  // @IsString()
  // @IsNotEmpty()
  // targetId: string;
}
export class GenerateUploadUrlResponseDto {
  @ApiProperty({
    description:
      'The pre-signed URL to be used by the client for a PUT request to upload the file directly to S3.',
  })
  uploadUrl: string;

  @ApiProperty({
    description:
      'The key of the file in the storage after it has been uploaded.',
  })
  fileKey: string;

  // @ApiProperty({
  //   description: 'The final public URL of the file after it has been uploaded.',
  // })
  // fileUrl: string;
}

export class DeleteFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileKey: string;
}
