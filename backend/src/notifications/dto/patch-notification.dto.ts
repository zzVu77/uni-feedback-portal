import { IsBoolean } from 'class-validator';
export class PatchNotificationDto {
  @IsBoolean()
  is_read: true;
}
