import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GenerateUploadUrlDto,
  GenerateUploadUrlResponseDto,
} from './dto/uploads.dto';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a pre-signed URL for file upload' })
  @ApiResponse({
    status: 200,
    description: 'Pre-signed URL generated successfully.',
    type: GenerateUploadUrlResponseDto,
  })
  generateUploadUrl(
    @Body() dto: GenerateUploadUrlDto,
  ): Promise<GenerateUploadUrlResponseDto> {
    return this.uploadsService.generateUploadUrl(dto);
  }
}
