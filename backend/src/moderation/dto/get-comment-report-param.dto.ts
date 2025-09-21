import { IsInt, Min } from 'class-validator';
export class GetCommentReportParamDto {
  @IsInt() @Min(1) comment_report_id: number;
}
