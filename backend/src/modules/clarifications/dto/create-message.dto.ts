import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFileAttachmentDto } from 'src/modules/uploads/dto';

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
    type: [CreateFileAttachmentDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFileAttachmentDto)
  attachments?: CreateFileAttachmentDto[];
}
