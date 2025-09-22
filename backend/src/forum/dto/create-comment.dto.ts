import { IsInt, IsString, Min, MinLength } from 'class-validator';
export class CreateCommentDto {
  @IsInt() @Min(1) post_id: number; // from path
  @IsString() @MinLength(1) content: string;
}
