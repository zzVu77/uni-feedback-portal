import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationEventListener } from './listeners/notification.listener';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationEventListener],
  exports: [NotificationsService],
})
export class NotificationsModule {}
