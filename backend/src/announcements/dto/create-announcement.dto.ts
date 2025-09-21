import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AnnouncementFileDto {
  @IsString() file_name: string;
  @IsString() file_url: string;
}

export class CreateAnnouncementDto {
  @IsString() @MinLength(3) title: string;
  @IsString() @MinLength(3) content: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnouncementFileDto)
  files?: AnnouncementFileDto[];
}
