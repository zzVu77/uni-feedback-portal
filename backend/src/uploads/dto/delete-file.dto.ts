import { IsString } from 'class-validator';
export class DeleteFileDto {
  @IsString()
  file_url: string;
}
