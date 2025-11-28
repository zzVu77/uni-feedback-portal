/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationType, UserRole } from '@prisma/client';
import { FeedbackCreatedEvent } from '../../feedbacks/events/feedback-created.event';

@Injectable()
export class NotificationEventListener {
  private readonly logger = new Logger(NotificationEventListener.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Handle the 'feedback.created' event.
   * This runs asynchronously (async: true) to avoid blocking the Feedback response.
   */
  @OnEvent('feedback.created', { async: true })
  async handleFeedbackCreatedEvent(payload: FeedbackCreatedEvent) {
    this.logger.log(
      `[Notification] Processing feedback.created event for Feedback ID: ${payload.feedbackId}`,
    );

    try {
      // 1. Notify the Student (Confirmation that feedback was sent)
      await this.notifyStudent(payload);

      // 2. Notify the Department Staff (The specific logic you requested)
      await this.notifyDepartmentStaff(payload);
    } catch (error) {
      this.logger.error(
        `[Notification] Failed to create notifications for feedback ${payload.feedbackId}`,
        error.stack,
      );
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  private async notifyStudent(payload: FeedbackCreatedEvent) {
    await this.notificationsService.createNotifications({
      userIds: [payload.userId], // The student who created the feedback
      content: `Your feedback "${payload.subject}" has been successfully submitted.`,
      type: NotificationType.FEEDBACK_SUBMITTED_NOTIFICATION,
      targetId: payload.feedbackId,
    });
  }

  private async notifyDepartmentStaff(payload: FeedbackCreatedEvent) {
    // STEP A: Find all users who are 'DEPARTMENT_STAFF' AND belong to the target 'departmentId'
    const staffMembers = await this.prisma.users.findMany({
      where: {
        departmentId: payload.departmentId, // Crucial: Filter by the department chosen by student
        role: UserRole.DEPARTMENT_STAFF, // Crucial: Only notify staff, not students or admins
      },
      select: { id: true },
    });

    if (!staffMembers || staffMembers.length === 0) {
      this.logger.warn(
        `[Notification] No staff members found for Department ID: ${payload.departmentId}. Notification skipped for staff.`,
      );
      return;
    }

    // STEP B: Extract IDs
    const staffIds = staffMembers.map((user) => user.id);

    // STEP C: Batch create notifications using existing service
    await this.notificationsService.createNotifications({
      userIds: staffIds,
      content: `New feedback received: "${payload.subject}".`,
      type: NotificationType.NEW_FEEDBACK_RECEIVED,
      targetId: payload.feedbackId,
    });

    this.logger.log(
      `[Notification] Sent notifications to ${staffIds.length} staff members of Department ${payload.departmentId}`,
    );
  }
}
