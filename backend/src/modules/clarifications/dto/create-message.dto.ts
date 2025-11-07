import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AttachmentDto {
  @ApiProperty({ example: 'screenshot.png' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'https://example.com/uploads/screenshot.png' })
  @IsString()
  fileUrl: string;
}

export class CreateMessageDto {
  @ApiPropertyOptional({
    description: 'The text content of the message.',
    example: 'Here is the document you requested.',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @ApiPropertyOptional({
    description: 'A list of files attached to the message.',
    type: [AttachmentDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
