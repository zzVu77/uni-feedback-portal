import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class AttachmentDto {
  @IsString() file_name: string;
  @IsString() file_url: string;
}

export class CreateFeedbackDto {
  @IsString() @MinLength(3) subject: string;
  @IsString() @MinLength(10) description: string;
  @IsInt() @Min(1) category_id: number;
  @IsInt() @Min(1) department_id: number;
  @IsBoolean() is_private: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
