import { IsInt, Min } from 'class-validator';
export class GetClarificationParamDto {
  @IsInt() @Min(1) conversation_id: number;
}
