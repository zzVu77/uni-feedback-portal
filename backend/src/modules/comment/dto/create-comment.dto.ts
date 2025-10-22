import { IsInt, IsString, Min, MinLength } from 'class-validator';
export class CreateCommentDto {
  @IsInt() @Min(1) postId: number; // from path
  @IsString() @MinLength(1) content: string;
}
