import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
export class NotificationResponseDto {
  @ApiProperty({
    description: 'The ID of the notification (UUID)',
    example: '5b7d6d5b-5c2f-4a41-a1c1-2a3e3e3b1234',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the user receiving the notification',
    example: '9c10cc8f-a0fa-479d-95e2-3a1e247c8e92',
  })
  userId: string;

  @ApiProperty({
    description: 'The content/body of the notification',
    example: 'Your feedback has been resolved.',
  })
  content: string;

  @ApiProperty({
    description: 'The type/category of the notification',
    enum: NotificationType,
    example: NotificationType.FEEDBACK_RESOLVED_NOTIFICATION,
  })
  notificationType: NotificationType;

  @ApiProperty({
    description: 'The ID of the related entity (feedback/comment/announcement)',
    example: 'f5039be8-1bc2-4f83-89e9-bb89f0512345',
  })
  targetId: string | null;

  @ApiProperty({
    description: 'The title of the related entity',
    example: 'New Feedback From Student',
  })
  title: string;
  @ApiProperty({
    description: 'Whether the notification has been read by the user',
    example: false,
  })
  isRead: boolean;

  @ApiProperty({
    description: 'Date when the notification was created',
    example: '2025-01-20T10:22:13.123Z',
  })
  createdAt: Date;
}
export class NotificationListResponseDto {
  @ApiProperty({
    description: 'List of notifications',
    type: [NotificationResponseDto],
  })
  results: NotificationResponseDto[];

  @ApiProperty({
    description: 'Total number of notifications matching the query',
    example: 42,
  })
  total: number;
}
export class NotificationUnreadCountResponseDto {
  @ApiProperty({
    description: 'Total number of unread notifications',
    example: 5,
  })
  unreadCount: number;
}
