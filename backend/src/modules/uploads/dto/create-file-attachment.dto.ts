import { OmitType } from '@nestjs/swagger';
import { FileAttachmentDto } from './file-attachment.dto';

export class CreateFileAttachmentDto extends OmitType(FileAttachmentDto, [
  'id',
] as const) {}
