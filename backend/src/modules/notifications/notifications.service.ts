import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import {
  NotificationListResponseDto,
  NotificationResponseDto,
} from './dto/notification-response.dto';
import { Prisma, Notifications } from '@prisma/client';
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // CREATE NOTIFICATIONS
  // ============================================
  async createNotifications(params: {
    userIds: string[];
    content: string;
    type: NotificationType;
    targetId?: string;
  }): Promise<NotificationResponseDto[]> {
    const { userIds, content, type, targetId } = params;

    const dataToCreate = userIds.map((userId) => ({
      userId,
      content,
      notificationType: type,
      targetId,
    }));

    await this.prisma.notifications.createMany({
      data: dataToCreate,
      skipDuplicates: true,
    });

    const createdNotifications = await this.prisma.notifications.findMany({
      where: {
        userId: { in: userIds },
        content,
        notificationType: type,
        targetId,
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
    type?: NotificationType;
    isRead?: boolean;
    from?: Date;
    to?: Date;
  }): Promise<NotificationListResponseDto> {
    const { userId, page = 1, pageSize = 20, type, isRead, from, to } = params;

    const where: Prisma.NotificationsWhereInput = { userId };
    const total = await this.prisma.notifications.count({ where });

    if (type) where.notificationType = type;
    if (isRead !== undefined) where.isRead = isRead;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

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
  // ============================================
  // HELPER - map Prisma notification -> DTO
  // ============================================
  private toDto(n: Notifications): NotificationResponseDto {
    return {
      id: n.id,
      userId: n.userId,
      content: n.content,
      notificationType: n.notificationType,
      targetId: n.targetId || undefined,
      isRead: n.isRead,
      createdAt: n.createdAt,
    };
  }
}
