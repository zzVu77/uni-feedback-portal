import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFileAttachmentDto } from 'src/modules/uploads/dto';
import { AtLeastOneOf } from 'src/shared/decorators/at-least-one-of.decorator';

export class CreateMessageDto {
  @ApiPropertyOptional({
    description: 'The text content of the message.',
    example: 'Here is the document you requested.',
  })
  @IsOptional()
  @IsString()
  @AtLeastOneOf(['attachments'], {
    message: 'Message must have either content or attachments',
  })
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
