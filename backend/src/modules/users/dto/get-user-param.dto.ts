import { IsString } from 'class-validator';

export class GetUserParamDto {
  @IsString()
  userId: string;
}
