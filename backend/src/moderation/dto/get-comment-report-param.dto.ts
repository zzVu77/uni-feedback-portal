import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCommentReportParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  comment_report_id: number;
}
