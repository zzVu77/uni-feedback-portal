import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteCommentParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  comment_id: number;
}
