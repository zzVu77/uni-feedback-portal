import { IsInt, Min } from 'class-validator';

export class GetUserParamDto {
  @IsInt()
  @Min(1)
  user_id: number;
}
