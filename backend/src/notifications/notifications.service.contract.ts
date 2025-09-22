import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { PatchNotificationDto } from './dto/patch-notification.dto';
import { BulkPatchNotificationsDto } from './dto/bulk-patch-notifications.dto';

export interface NotificationsServiceContract {
  list(
    user_id: number,
    query: QueryNotificationsDto,
  ): Promise<{
    items: Array<{
      notification_id: number;
      content: string;
      notification_type: string;
      is_read: boolean;
      created_at: string;
    }>;
    total: number;
  }>;
  markOne(
    notification_id: number,
    user_id: number,
    dto: PatchNotificationDto,
  ): Promise<{ notification_id: number; is_read: boolean }>;
  markBulk(
    user_id: number,
    dto: BulkPatchNotificationsDto,
  ): Promise<{ success: true; affected: number }>;
}
