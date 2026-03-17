import { IsUUID } from 'class-validator';

export class GetUserParamDto {
  @IsUUID('loose')
  userId: string;
}
