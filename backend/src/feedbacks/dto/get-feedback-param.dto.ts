import { IsInt, Min } from 'class-validator';
export class GetFeedbackParamDto {
  @IsInt() @Min(1) feedback_id: number;
}
