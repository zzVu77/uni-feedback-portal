import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import {
  NotificationListResponseDto,
  NotificationResponseDto,
} from './dto/notification-response.dto';
import { Prisma, Notifications } from '@prisma/client';
import { GroupNotiFilter } from './dto';
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly FEEDBACK_TYPES: NotificationType[] = [
    NotificationType.FEEDBACK_SUBMITTED_NOTIFICATION,
    NotificationType.FEEDBACK_PROCESSING_NOTIFICATION,
    NotificationType.FEEDBACK_RESOLVED_NOTIFICATION,
    NotificationType.FEEDBACK_REJECTED_NOTIFICATION,
    NotificationType.NEW_FEEDBACK_RECEIVED,
    NotificationType.FEEDBACK_FORWARDED_TO_YOU,
    NotificationType.MESSAGE_NEW_NOTIFICATION,
    NotificationType.CLARIFICATION_NEW_NOTIFICATION,
    NotificationType.CLARIFICATION_CLOSED_NOTIFICATION,
  ];
  private readonly FORUM_TYPES: NotificationType[] = [
    NotificationType.VOTE_FORUM_POST_NOTIFICATION,
    NotificationType.COMMENT_FORUM_POST_NOTIFICATION,
    NotificationType.REPLY_COMMENT_FORUM_POST_NOTIFICATION,
    NotificationType.NEW_COMMENT_REPORT_FOR_ADMIN,
  ];
  private readonly ANNOUNCEMENT_TYPES: NotificationType[] = [
    NotificationType.NEW_ANNOUNCEMENT_NOTIFICATION,
    NotificationType.COMMENT_ANNOUNCEMENT_NOTIFICATION,
    NotificationType.REPLY_COMMENT_ANNOUNCEMENT_NOTIFICATION,
    NotificationType.NEW_COMMENT_REPORT_FOR_ADMIN,
  ];

  // ============================================
  // CREATE NOTIFICATIONS
  // ============================================
  async createNotifications(params: {
    userIds: string[];
    content: string;
    type: NotificationType;
    targetId: string | null;
    title: string;
  }): Promise<NotificationResponseDto[]> {
    const { userIds, content, type, targetId, title } = params;
    let finalUserIds = userIds;
    const broadcastTypes: NotificationType[] = [
      NotificationType.NEW_ANNOUNCEMENT_NOTIFICATION,
      // NotificationType.ADMIN_NOTIFICATION,
      // NotificationType.SYSTEM_ANNOUNCEMENT_NOTIFICATION,
    ];

    if (broadcastTypes.includes(type)) {
      const allUsers = await this.prisma.users.findMany({
        select: { id: true },
        where: { role: 'STUDENT' },
      });
      finalUserIds = allUsers.map((u) => u.id);
    }

    if (!finalUserIds || finalUserIds.length === 0) {
      return [];
    }
    const dataToCreate = finalUserIds.map((userId) => ({
      userId,
      content,
      notificationType: type,
      targetId,
      title,
    }));

    await this.prisma.notifications.createMany({
      data: dataToCreate,
      skipDuplicates: true,
    });

    const createdNotifications = await this.prisma.notifications.findMany({
      where: {
        userId: { in: finalUserIds },
        content,
        notificationType: type,
        targetId,
        title,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return createdNotifications.map((n) => this.toDto(n));
  }

  // ============================================
  // MARK AS READ
  // ============================================
  async markAsRead(params: {
    ids?: string[];
    all?: boolean;
    type?: NotificationType[];
    isRead?: boolean;
    userId: string;
  }): Promise<NotificationResponseDto[]> {
    const { ids, all, type, isRead = true, userId } = params;

    const where: Prisma.NotificationsWhereInput = { userId };

    if (!all) {
      if (ids && ids.length > 0) where.id = { in: ids };
      else if (type) {
        where.notificationType = { in: type };
      }
    }
    await this.prisma.notifications.updateMany({
      where,
      data: { isRead },
    });

    // Lấy lại dữ liệu vừa cập nhật
    const updatedNotifications = await this.prisma.notifications.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return updatedNotifications.map((n) => this.toDto(n));
  }

  // ============================================
  // DELETE NOTIFICATIONS
  // ============================================
  async deleteNotifications(params: {
    ids?: string[];
    all?: boolean;
    type?: NotificationType[];
    userId: string;
  }): Promise<{ deletedCount: number }> {
    const { ids, all, type, userId } = params;

    const where: Prisma.NotificationsWhereInput = { userId };

    if (!all) {
      if (ids && ids.length > 0) where.id = { in: ids };
      else if (type) {
        where.notificationType = { in: type };
      }
    }

    const deleted = await this.prisma.notifications.deleteMany({
      where,
    });

    return { deletedCount: deleted.count };
  }
  async queryNotifications(params: {
    userId: string;
    page?: number;
    pageSize?: number;
    type?: GroupNotiFilter; // Changed from NotificationType to GroupNotiFilter
    isRead?: boolean;
    from?: Date;
    to?: Date;
  }): Promise<NotificationListResponseDto> {
    const { userId, page = 1, pageSize = 20, type, isRead, from, to } = params;

    const where: Prisma.NotificationsWhereInput = { userId };
    const normalizedType = type?.toUpperCase();
    // Filter by Group Type
    if (normalizedType && normalizedType !== 'ALL') {
      const mappedTypes = this.getNotificationTypesByGroup(
        normalizedType as GroupNotiFilter,
      );
      if (mappedTypes.length > 0) {
        where.notificationType = { in: mappedTypes };
      }
    }

    if (isRead !== undefined) where.isRead = isRead;
    else if (isRead === 'all') where.isRead = true;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    // Get Total count for pagination
    const total = await this.prisma.notifications.count({ where });

    // Get Data
    const notifications: Notifications[] =
      await this.prisma.notifications.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

    const results: NotificationResponseDto[] = notifications.map((n) =>
      this.toDto(n),
    );

    return { results, total };
  }

  // Helper to map GroupFilter to NotificationType[]
  private getNotificationTypesByGroup(
    group: GroupNotiFilter,
  ): NotificationType[] {
    switch (group) {
      case 'FEEDBACK':
        return this.FEEDBACK_TYPES;
      case 'FORUM':
        return this.FORUM_TYPES;
      // You can add ANNOUNCEMENT here if you add it to the DTO Enum later
      default:
        return [];
    }
  }
  // ============================================
  // HELPER - map Prisma notification -> DTO
  // ============================================
  private toDto(n: Notifications): NotificationResponseDto {
    return {
      id: n.id,
      userId: n.userId,
      content: n.content,
      notificationType: n.notificationType,
      targetId: n.targetId,
      title: n.title,
      isRead: n.isRead,
      createdAt: n.createdAt,
    };
  }
}
