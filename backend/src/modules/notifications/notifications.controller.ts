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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import {
  NotificationResponseDto,
  UpdateNotificationsDto,
  CreateNotificationsDto,
  QueryNotificationsDto,
  NotificationListResponseDto,
  DeleteNotificationsDto,
  NotificationUnreadCountResponseDto,
} from './dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { UserRole } from '@prisma/client';

@ApiTags('Notifications')
@ApiBearerAuth()
// @UseGuards(RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ============================================
  // CREATE NOTIFICATION(S)
  // ============================================
  @Post()
  // @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create one or many notifications (Admin only)' })
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
      userIds: dto.userIds ? dto.userIds : [],
      content: dto.content,
      type: dto.type,
      targetId: dto.targetId,
    });
  }

  // ============================================
  // UPDATE NOTIFICATION(S) - MARK AS READ
  // ============================================
  @Patch('read')
  // @Roles(UserRole.STUDENT, UserRole.DEPARTMENT_STAFF, UserRole.ADMIN)
  @ApiOperation({ summary: 'Mark notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'Notifications updated successfully',
    type: [NotificationResponseDto],
  })
  async markAsRead(
    @Body() dto: UpdateNotificationsDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationsService.markAsRead({
      ids: dto.ids,
      all: dto.all,
      type: dto.type,
      isRead: dto.isRead,
      userId: user.sub, // thêm userId
    });
  }

  // ============================================
  // DELETE NOTIFICATION(S)
  // ============================================
  @Delete()
  // @Roles(UserRole.STUDENT, UserRole.DEPARTMENT_STAFF, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete one or many notifications' })
  @ApiResponse({
    status: 200,
    description: 'Notifications deleted successfully',
  })
  async deleteNotifications(
    @Body() dto: DeleteNotificationsDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<{ deletedCount: number }> {
    return this.notificationsService.deleteNotifications({
      ids: dto.ids,
      all: dto.all,
      type: dto.type,
      userId: user.sub, // thêm userId
    });
  }
  // ============================================
  // QUERY NOTIFICATIONS
  // ============================================
  @Get()
  // @Roles(UserRole.STUDENT, UserRole.DEPARTMENT_STAFF, UserRole.ADMIN)
  @ApiOperation({ summary: 'Query notifications with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications matching query',
    type: [NotificationResponseDto],
  })
  async queryNotifications(
    @Query() query: QueryNotificationsDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<NotificationListResponseDto> {
    return this.notificationsService.queryNotifications({
      userId: user.sub,
      page: query.page,
      pageSize: query.pageSize,
      type: query.type,
      isRead: query.isRead ?? undefined,
      from: query.from,
      to: query.to,
    });
  }
  // ============================================
  // GET QUANTITY UNREAD NOTIFICATIONS
  // ============================================
  @Get('unread-count')
  @ApiOperation({ summary: 'Get quantity of unread notifications' })
  @ApiResponse({
    status: 200,
    description: 'Quantity of unread notifications',
    type: NotificationUnreadCountResponseDto,
  })
  async getUnreadCount(
    @ActiveUser() user: ActiveUserData,
  ): Promise<NotificationUnreadCountResponseDto> {
    const unreadCount = await this.notificationsService.getUnreadCount(
      user.sub,
    );
    return { unreadCount };
  }
}
