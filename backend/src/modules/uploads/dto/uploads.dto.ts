import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GenerateUploadUrlDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileType: string;
}

export class GenerateUploadUrlResponseDto {
  @ApiProperty()
  uploadUrl: string;

  @ApiProperty()
  fileUrl: string;
}

export class DeleteFileDto {
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;
}
