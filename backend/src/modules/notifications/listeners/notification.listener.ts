/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CommentTargetType,
  FeedbackStatus,
  NotificationType,
  UserRole,
} from '@prisma/client';
import { FeedbackCreatedEvent } from '../../feedbacks/events/feedback-created.event';
import { FeedbackStatusUpdatedEvent } from 'src/modules/feedback_management/events/feedback-status-updated.event';
import { ClarificationMessageSentEvent } from 'src/modules/clarifications/events/clarification-message-sent.event';
import { ClarificationEvent } from 'src/modules/clarifications/events/clarification.event';
import { CommentCreatedEvent } from 'src/modules/comment/events/comment-created.event';
import { CommentReportCreatedEvent } from 'src/modules/comment/events/comment-report-created.event';
import { ForumPostVotedEvent } from 'src/modules/forum/events/forum-post-voted.event';
import { ClarificationsGateway } from 'src/modules/clarifications/clarifications.gateway';
import { FeedbackForwardingEvent } from 'src/modules/feedback_management/events/feedback-forwarding.event';

@Injectable()
export class NotificationEventListener {
  private readonly logger = new Logger(NotificationEventListener.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
    private readonly clarificationsGateway: ClarificationsGateway,
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

      // 3. Notify Student about Toxicity Check
      await this.notifyFeedbackCheckToxicity(payload);
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
        title: payload.subject,
      });
    } catch (error) {
      this.logger.error(
        `[Notification] Failed to notify status update for feedback ${payload.feedbackId}`,
        error.stack,
      );
    }
  }
  /**
   * Handle 'feedback.status_updated' event
   * Triggered when staff updates feedback status
   */
  @OnEvent('feedback.forwarded', { async: true })
  async handleFeedbackForwardingEvent(payload: FeedbackForwardingEvent) {
    this.logger.log(
      `[Notification] Processing Forwarding Feedback from department: ${payload.sender.departmentName} to ${payload.recipient.departmentName}`,
    );

    try {
      //send notification to sender department staff
      await this.notificationsService.createNotifications({
        userIds: [payload.sender.senderId],
        content: `Góp ý "${payload.feedback.subject}" đã được chuyển từ phòng ban của bạn đến phòng ban ${payload.recipient.departmentName}.`,
        type: NotificationType.FEEDBACK_FORWARDED,
        targetId: payload.feedback.id,
        title: payload.feedback.subject,
      });
      //find all department staff of specific recipient department
      const recipientDepartmentStaff = await this.prisma.users.findMany({
        where: { departmentId: payload.recipient.departmentId },
        select: { id: true },
      });

      //send notification to recipient department staff
      await this.notificationsService.createNotifications({
        userIds: recipientDepartmentStaff.map((staff) => staff.id),
        content: `Góp ý "${payload.feedback.subject}" đã được chuyển từ phòng ban ${payload.sender.departmentName} đến phòng ban của bạn.`,
        type: NotificationType.FEEDBACK_FORWARDED_TO_YOU,
        targetId: payload.feedback.id,
        title: payload.feedback.subject,
      });
    } catch (error) {
      this.logger.error(
        `[Notification] Failed to notify forwarding for feedback ${payload.feedback.id}`,
        error.stack,
      );
    }
  }
  // ============================================
  // HANDLER: CLARIFICATION CREATED
  // ============================================
  @OnEvent('clarification.created', { async: true })
  async handleClarificationCreated(payload: ClarificationEvent) {
    this.logger.log(
      `[Notification] Processing clarification.created for conversation: ${payload.conversationId}`,
    );
    try {
      await this.notificationsService.createNotifications({
        userIds: [payload.studentId],
        content: `Đại diện phòng ban đã gửi 1 yêu cầu trao đổi: "${payload.subject}".`,
        type: NotificationType.CLARIFICATION_NEW_NOTIFICATION,
        targetId: payload.feedbackId,
        title: payload.subject,
      });
    } catch (error) {
      this.logger.error(
        `Failed to notify student about clarification ${payload.conversationId}`,
        error.stack,
      );
    }
  }
  // ============================================
  // HANDLER: CLARIFICATION CLOSED
  // ============================================
  @OnEvent('clarification.closed', { async: true })
  async handleClarificationClosed(payload: ClarificationEvent) {
    this.logger.log(
      `[Notification] Processing clarification.closed for conversation: ${payload.conversationId}`,
    );
    try {
      await this.notificationsService.createNotifications({
        userIds: [payload.studentId],
        content: `Yêu cầu làm rõ "${payload.subject}" đã được đóng.`,
        type: NotificationType.CLARIFICATION_CLOSED_NOTIFICATION,
        targetId: payload.feedbackId,
        title: payload.subject,
      });
    } catch (error) {
      this.logger.error(
        `Failed to notify student about clarification ${payload.conversationId}`,
        error.stack,
      );
    }
  }

  // ============================================
  // HANDLER: MESSAGE SENT (2-WAY)
  // ============================================
  @OnEvent('clarification.message_sent', { async: true })
  async handleClarificationMessageSent(payload: ClarificationMessageSentEvent) {
    this.logger.log(
      `[Notification] Processing message sent in conversation: ${payload.conversationId} to user ${payload.recipientId}`,
    );

    try {
      const previewContent =
        payload.content.length > 50
          ? payload.content.substring(0, 50) + '...'
          : payload.content;

      await this.notificationsService.createNotifications({
        userIds: [payload.recipientId],
        content: `Bạn có tin nhắn mới: "${previewContent}"`,
        type: NotificationType.MESSAGE_NEW_NOTIFICATION,
        targetId: payload.feedbackId,
        title: payload.subject,
      });

      this.clarificationsGateway.notifyClarificationMessage(
        payload.recipientId,
        payload,
      );
    } catch (error) {
      this.logger.error(
        `Failed to notify new message in conversation ${payload.conversationId}`,
        error.stack,
      );
    }
  }
  // ============================================
  // HANDLER: COMMENT CREATED
  // ============================================
  @OnEvent('comment.created', { async: true })
  async handleCommentCreated(payload: CommentCreatedEvent) {
    this.logger.log(
      `[Notification] Processing comment.created for ID: ${payload.commentId}`,
    );

    try {
      // CASE 1: THIS IS A REPLY (Reply to comment)
      if (payload.parentId) {
        await this.handleReplyNotification(payload);
        return;
      }

      // CASE 2: THIS IS A ROOT COMMENT (Root Comment)
      if (payload.targetType === CommentTargetType.ANNOUNCEMENT) {
        await this.handleAnnouncementCommentNotification(payload);
      } else if (payload.targetType === CommentTargetType.FORUM_POST) {
        await this.handleForumPostCommentNotification(payload);
      }
    } catch (error) {
      this.logger.error(
        `Failed to process notification for comment ${payload.commentId}`,
        error.stack,
      );
    }
  }

  // --- Logic : Handle Reply ---
  private async handleReplyNotification(payload: CommentCreatedEvent) {
    // The calling function `handleCommentCreated` already ensures parentId is not null.
    // We add a check here for type safety and to handle any unexpected cases.
    if (!payload.parentId) return;

    const parentComment = await this.prisma.comments.findUnique({
      where: { id: payload.parentId },
      select: { userId: true },
    });

    if (!parentComment) return;

    // Do not notify if user replies to their own comment
    if (parentComment.userId === payload.userId) return;

    const targetInfo = await this.getTargetInfo(
      payload.targetId,
      payload.targetType,
    );
    // Determine notification type based on targetType
    const type =
      payload.targetType === CommentTargetType.FORUM_POST
        ? NotificationType.REPLY_COMMENT_FORUM_POST_NOTIFICATION
        : NotificationType.REPLY_COMMENT_ANNOUNCEMENT_NOTIFICATION;

    await this.notificationsService.createNotifications({
      userIds: [parentComment.userId],
      content: `Có người vừa trả lời bình luận của bạn: "${this.previewContent(payload.content)}"`,
      type: type,
      targetId: payload.targetId, // Link to Post/Announcement
      title: targetInfo.title,
    });
  }

  // --- Logic : Handle Announcement Comment ---
  private async handleAnnouncementCommentNotification(
    payload: CommentCreatedEvent,
  ) {
    // Find Announcement to get owner (creator of announcement)
    const announcement = await this.prisma.announcements.findUnique({
      where: { id: payload.targetId },
      select: { userId: true, title: true },
    });

    if (!announcement) return;

    // Do not notify if user comments on their own announcement
    if (announcement.userId === payload.userId) return;
    const targetInfo = await this.getTargetInfo(
      payload.targetId,
      payload.targetType,
    );
    await this.notificationsService.createNotifications({
      userIds: [announcement.userId],
      content: `Nội dung bình luận: "${this.previewContent(payload.content)}"`,
      type: NotificationType.COMMENT_ANNOUNCEMENT_NOTIFICATION,
      targetId: payload.targetId,
      title: targetInfo.title,
    });
  }

  // --- Logic : Handle Forum Post Comment ---
  private async handleForumPostCommentNotification(
    payload: CommentCreatedEvent,
  ) {
    //Find ForumPost -> Feedback -> User (Student)
    const post = await this.prisma.forumPosts.findUnique({
      where: { id: payload.targetId },
      include: {
        feedback: {
          select: { userId: true, subject: true },
        },
      },
    });

    if (!post || !post.feedback) return;

    // Do not notify if user comments on their own post
    if (post.feedback.userId === payload.userId) return;
    const targetInfo = await this.getTargetInfo(
      payload.targetId,
      payload.targetType,
    );
    await this.notificationsService.createNotifications({
      userIds: [post.feedback.userId],
      content: `Có bình luận mới trên bài đăng: "${this.previewContent(payload.content)}"`,
      type: NotificationType.COMMENT_FORUM_POST_NOTIFICATION,
      targetId: payload.targetId,
      title: targetInfo.title,
    });
  }
  // ============================================
  // HANDLER: COMMENT REPORT CREATED (To Admins)
  // ============================================
  @OnEvent('comment.report_created', { async: true })
  async handleCommentReportCreated(payload: CommentReportCreatedEvent) {
    this.logger.log(
      `[Notification] Processing report creation for Comment ID: ${payload.commentId}`,
    );

    try {
      // 1. Tìm tất cả Admin trong hệ thống
      const admins = await this.prisma.users.findMany({
        where: { role: UserRole.ADMIN },
        select: { id: true },
      });

      if (!admins || admins.length === 0) {
        this.logger.warn(
          '[Notification] No admins found to receive report notification.',
        );
        return;
      }

      const adminIds = admins.map((admin) => admin.id);

      // 2. Tạo nội dung thông báo
      // Ví dụ: "New report submitted for a comment. Reason: Offensive content..."
      const reasonText = payload.reason
        ? ` Lý do: "${payload.reason.length > 30 ? payload.reason.substring(0, 30) + '...' : payload.reason}"`
        : '';

      const content = `Có báo cáo mới về bình luận.${reasonText}`;

      const targetInfo = await this.getTargetInfo(
        payload.targetId,
        payload.targetType as CommentTargetType,
      );
      // 3. Gửi thông báo
      await this.notificationsService.createNotifications({
        userIds: adminIds,
        content: content,
        type: NotificationType.NEW_COMMENT_REPORT_FOR_ADMIN,
        targetId: payload.reportId,
        title: targetInfo.title,
      });

      this.logger.log(
        `[Notification] Sent report notification to ${adminIds.length} admins.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to notify admins about report ${payload.reportId}`,
        error.stack,
      );
    }
  }

  // ============================================
  // NEW HANDLER: VOTE FORUM POST
  // ============================================
  @OnEvent('forum.post_voted', { async: true })
  async handleForumPostVoted(payload: ForumPostVotedEvent) {
    this.logger.log(
      `[Notification] Processing vote for Post ID: ${payload.postId} by User: ${payload.userId}`,
    );

    try {
      // 1. Get Post Detail to find the Owner (Student)
      const post = await this.prisma.forumPosts.findUnique({
        where: { id: payload.postId },
        include: {
          feedback: {
            select: {
              userId: true,
              subject: true,
            },
          },
        },
      });

      if (!post || !post.feedback) return;

      // 2. Anti-spam check: Do not notify if user votes for their own post
      if (post.feedback.userId === payload.userId) {
        return;
      }

      // 3. Create Notification
      await this.notificationsService.createNotifications({
        userIds: [post.feedback.userId],
        content: `Bài viết "${this.previewContent(post.feedback.subject)}" của bạn vừa có 1 lượt ủng hộ.`,
        type: NotificationType.VOTE_FORUM_POST_NOTIFICATION,
        targetId: payload.postId,
        title: post.feedback.subject,
      });
    } catch (error) {
      this.logger.error(
        `Failed to notify vote for post ${payload.postId}`,
        error.stack,
      );
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================
  // Helper to preview content
  private previewContent(content: string): string {
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  }

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
        return `Góp ý "${subject}" của bạn đang được xử lý.`;
      case FeedbackStatus.RESOLVED:
        return `Góp ý "${subject}" của bạn đã được giải quyết.`;
      case FeedbackStatus.REJECTED:
        return `Góp ý "${subject}" của bạn đã bị từ chối.`;
      default:
        return `Trạng thái góp ý "${subject}" của bạn đã được cập nhật.`;
    }
  }

  private async notifyStudent(payload: FeedbackCreatedEvent) {
    await this.notificationsService.createNotifications({
      userIds: [payload.userId],
      content: `Góp ý "${payload.subject}" của bạn đã được gửi thành công.`,
      type: NotificationType.FEEDBACK_SUBMITTED_NOTIFICATION,
      targetId: payload.feedbackId,
      title: payload.subject,
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
      content: `Bạn vừa nhận được một góp ý mới: "${payload.subject}".`,
      type: NotificationType.NEW_FEEDBACK_RECEIVED,
      targetId: payload.feedbackId,
      title: payload.subject,
    });

    this.logger.log(
      `[Notification] Sent notifications to ${staffIds.length} staff members of Department ${payload.departmentId}`,
    );
  }

  private async getTargetInfo(
    targetId: string,
    targetType: CommentTargetType,
  ): Promise<{ title: string }> {
    switch (targetType) {
      case CommentTargetType.ANNOUNCEMENT: {
        const announcement = await this.prisma.announcements.findUnique({
          where: { id: targetId },
          select: { title: true },
        });

        if (!announcement) {
          throw new Error(`Announcement ${targetId} not found`);
        }

        return { title: announcement.title };
      }

      case CommentTargetType.FORUM_POST: {
        const post = await this.prisma.forumPosts.findUnique({
          where: { id: targetId },
          select: {
            feedback: {
              select: { subject: true },
            },
          },
        });

        if (!post || !post.feedback) {
          throw new Error(`Forum post ${targetId} not found`);
        }

        return { title: post.feedback.subject };
      }

      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid target type: ${targetType}`);
    }
  }

  private async notifyFeedbackCheckToxicity(payload: FeedbackCreatedEvent) {

    let content = `Góp ý "${payload.subject}" của bạn đã được xác định là phù hợp với quy định cộng đồng. Cảm ơn bạn đã đóng góp ý kiến!`;
    let type:NotificationType = NotificationType.FEEDBACK_TOXIC_ACCEPTED;
    if (payload.isToxic) {
      content = `Góp ý "${payload.subject}" của bạn đã được xác định là có nội dung không phù hợp và vi phạm quy định cộng đồng. Vui lòng chỉnh sửa và gửi lại góp ý.`;
      type = NotificationType.FEEDBACK_TOXIC_REJECTED;
    }
    await this.notificationsService.createNotifications({
      userIds: [payload.userId],
      content: content,
      type: type,
      targetId: payload.feedbackId,
      title: payload.subject,
    });

    
  }
}
