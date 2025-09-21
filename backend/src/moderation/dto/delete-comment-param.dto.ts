import { IsInt, Min } from 'class-validator';
export class DeleteCommentParamDto {
  @IsInt() @Min(1) comment_id: number;
}
