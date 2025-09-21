import { IsInt, IsString, Min, MinLength } from 'class-validator';
export class CreateMessageDto {
  @IsInt() @Min(1) conversation_id: number; // from path
  @IsString() @MinLength(1) content: string;
}
