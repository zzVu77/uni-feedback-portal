import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class CloseClarificationDto {
  @IsBoolean() is_closed: true;
  @IsOptional() @IsString() message?: string;
}
