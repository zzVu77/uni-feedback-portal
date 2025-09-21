import { IsInt, Min } from 'class-validator';
export class GetPostParamDto {
  @IsInt() @Min(1) post_id: number;
}
