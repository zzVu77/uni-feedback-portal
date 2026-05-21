import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateAvatarAttachmentDto } from 'src/modules/uploads/dto';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The new full name of the user',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  fullName?: string;
  @ApiPropertyOptional({
    description: 'The new avatar of the user',
    type: CreateAvatarAttachmentDto,
  })
  @IsOptional()
  attachment?: CreateAvatarAttachmentDto;
}
