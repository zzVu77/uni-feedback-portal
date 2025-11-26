import { IsString, IsUUID } from 'class-validator';

export class GetUserParamDto {
  @IsString()
  @IsUUID()
  userId: string;
}
