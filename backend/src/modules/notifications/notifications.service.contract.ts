import { NotificationType } from '@prisma/client';
import {
  NotificationListResponseDto,
  NotificationResponseDto,
} from './dto/notification-response.dto';

export interface NotificationsServiceContract {
  createNotifications(params: {
    userIds: string[];
    content: string;
    type: NotificationType;
    targetId?: string;
  }): Promise<NotificationResponseDto[]>;

  markAsRead(params: {
    ids?: string[];
    all?: boolean;
    type?: NotificationType[];
    isRead?: boolean;
    userId: string;
  }): Promise<NotificationResponseDto[]>;

  deleteNotifications(params: {
    ids?: string[];
    all?: boolean;
    type?: NotificationType[];
    userId: string;
  }): Promise<{ deletedCount: number }>;

  queryNotifications(params: {
    userId: string;
    page?: number;
    pageSize?: number;
    type?: NotificationType;
    isRead?: boolean;
    from?: Date;
    to?: Date;
  }): Promise<NotificationListResponseDto>;
}
