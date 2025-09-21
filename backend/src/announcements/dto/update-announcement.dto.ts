import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AnnouncementFileDto } from './create-announcement.dto';

export class UpdateAnnouncementDto {
  @IsOptional() @IsString() @MinLength(3) title?: string;
  @IsOptional() @IsString() @MinLength(3) content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnouncementFileDto)
  files?: AnnouncementFileDto[];
}
