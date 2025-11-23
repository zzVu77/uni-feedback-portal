import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import {
  NotificationResponseDto,
  UpdateNotificationsDto,
  CreateNotificationsDto,
  QueryNotificationsDto,
  NotificationListResponseDto,
  DeleteNotificationsDto,
} from './dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ====== HARD-CODE USER ID (future: replace with @User() decorator) ======
  private readonly userId = '550e8400-e29b-41d4-a716-446655440009';

  // ============================================
  // CREATE NOTIFICATION(S)
  // ============================================
  @Post()
  @ApiOperation({ summary: 'Create one or many notifications' })
  @ApiResponse({
    status: 201,
    description: 'Notifications created successfully',
    type: [NotificationResponseDto],
  })
  async createNotifications(
    @Body() dto: CreateNotificationsDto,
  ): Promise<NotificationResponseDto[]> {
    // Pass field-by-field, không truyền DTO trực tiếp
    return this.notificationsService.createNotifications({
      userIds: dto.userIds,
      content: dto.content,
      type: dto.type,
      targetId: dto.targetId,
    });
  }

  // ============================================
  // UPDATE NOTIFICATION(S) - MARK AS READ
  // ============================================
  @Patch('read')
  @ApiOperation({ summary: 'Mark notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'Notifications updated successfully',
    type: [NotificationResponseDto],
  })
  async markAsRead(
    @Body() dto: UpdateNotificationsDto,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationsService.markAsRead({
      ids: dto.ids,
      all: dto.all,
      type: dto.type,
      isRead: dto.isRead,
      userId: this.userId, // thêm userId
    });
  }

  // ============================================
  // DELETE NOTIFICATION(S)
  // ============================================
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete one or many notifications' })
  @ApiResponse({
    status: 200,
    description: 'Notifications deleted successfully',
  })
  async deleteNotifications(
    @Body() dto: DeleteNotificationsDto,
  ): Promise<{ deletedCount: number }> {
    return this.notificationsService.deleteNotifications({
      ids: dto.ids,
      all: dto.all,
      type: dto.type,
      userId: this.userId, // thêm userId
    });
  }
  // ============================================
  // QUERY NOTIFICATIONS
  // ============================================
  @Get()
  @ApiOperation({ summary: 'Query notifications with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications matching query',
    type: [NotificationResponseDto],
  })
  async queryNotifications(
    @Query() query: QueryNotificationsDto,
  ): Promise<NotificationListResponseDto> {
    // dùng userId cứng trước khi integrate decorator
    const userId = this.userId;

    return this.notificationsService.queryNotifications({
      userId,
      page: query.page,
      pageSize: query.pageSize,
      type: query.type,
      isRead: query.isRead ?? undefined,
      from: query.from,
      to: query.to,
    });
  }
}
