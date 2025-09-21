import { IsInt, Min } from 'class-validator';
export class GetAnnouncementParamDto {
  @IsInt() @Min(1) id: number;
}
