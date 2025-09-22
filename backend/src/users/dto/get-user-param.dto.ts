import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;
}
