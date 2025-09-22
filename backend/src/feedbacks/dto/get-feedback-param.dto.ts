import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFeedbackParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  feedback_id: number;
}
