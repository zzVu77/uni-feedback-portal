import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationEventListener } from './listeners/notification.listener';
import { ClarificationsModule } from '../clarifications/clarifications.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationEventListener],
  exports: [NotificationsService],
  imports: [ClarificationsModule],
})
export class NotificationsModule {}
