import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  post_id: number;
}
