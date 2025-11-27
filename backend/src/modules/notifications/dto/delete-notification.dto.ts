import { OmitType } from '@nestjs/swagger';
import { UpdateNotificationsDto } from './update-notification.dto';

export class DeleteNotificationsDto extends OmitType(UpdateNotificationsDto, [
  'isRead',
] as const) {}
