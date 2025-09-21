import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateForwardingDto {
  @IsInt() @Min(1) to_department_id: number;
  @IsOptional() @IsString() message?: string;
}
