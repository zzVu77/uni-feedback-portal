import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetClarificationParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  conversation_id: number;
}
