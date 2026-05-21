import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ALLOWED_AVATAR_FILE_TYPES } from './file-attachment.dto';
import { CreateFileAttachmentDto } from './create-file-attachment.dto';

export class CreateAvatarAttachmentDto extends CreateFileAttachmentDto {
  @ApiProperty({ example: 'image/png', enum: ALLOWED_AVATAR_FILE_TYPES })
  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_AVATAR_FILE_TYPES, {
    message: 'Avatar file type must be PNG or JPEG',
  })
  declare fileType: string;
}
