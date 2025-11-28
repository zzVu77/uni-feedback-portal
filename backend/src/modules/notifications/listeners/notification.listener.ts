/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import { FeedbackStatus, NotificationType, UserRole } from '@prisma/client';
import { FeedbackCreatedEvent } from '../../feedbacks/events/feedback-created.event';
import { FeedbackStatusUpdatedEvent } from 'src/modules/feedback_management/events/feedback-status-updated.event';

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

  /**
   * Handle 'feedback.status_updated' event
   * Triggered when staff updates feedback status
   */
  @OnEvent('feedback.status_updated', { async: true })
  async handleFeedbackStatusUpdatedEvent(payload: FeedbackStatusUpdatedEvent) {
    this.logger.log(
      `[Notification] Processing status update for Feedback ID: ${payload.feedbackId} to ${payload.status}`,
    );

    try {
      const notificationType = this.mapStatusToNotificationType(payload.status);

      if (!notificationType) {
        return;
      }

      const content = this.generateStatusMessage(
        payload.status,
        payload.subject,
      );

      await this.notificationsService.createNotifications({
        userIds: [payload.userId],
        content: content,
        type: notificationType,
        targetId: payload.feedbackId,
      });
    } catch (error) {
      this.logger.error(
        `[Notification] Failed to notify status update for feedback ${payload.feedbackId}`,
        error.stack,
      );
    }
  }
  // ==========================================
  // HELPER METHODS
  // ==========================================
  private mapStatusToNotificationType(
    status: FeedbackStatus,
  ): NotificationType | null {
    switch (status) {
      case FeedbackStatus.IN_PROGRESS:
        return NotificationType.FEEDBACK_PROCESSING_NOTIFICATION;
      case FeedbackStatus.RESOLVED:
        return NotificationType.FEEDBACK_RESOLVED_NOTIFICATION;
      case FeedbackStatus.REJECTED:
        return NotificationType.FEEDBACK_REJECTED_NOTIFICATION;
      default:
        return null; // Ignore PENDING or other statuses if any
    }
  }

  private generateStatusMessage(
    status: FeedbackStatus,
    subject: string,
  ): string {
    switch (status) {
      case FeedbackStatus.IN_PROGRESS:
        return `Your feedback "${subject}" is now being processed.`;
      case FeedbackStatus.RESOLVED:
        return `Your feedback "${subject}" has been resolved.`;
      case FeedbackStatus.REJECTED:
        return `Your feedback "${subject}" has been rejected.`;
      default:
        return `Your feedback "${subject}" status has been updated.`;
    }
  }

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
