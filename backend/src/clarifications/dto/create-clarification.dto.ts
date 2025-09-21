import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateClarificationDto {
  @IsInt() @Min(1) feedback_id: number;
  @IsOptional() @IsString() initial_message?: string;
}
