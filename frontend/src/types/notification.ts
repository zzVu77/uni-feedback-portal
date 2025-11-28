export type TypeOfNotification =
  // Vote notification
  | "VOTE_FORUM_POST_NOTIFICATION"
  | "COMMENT_FORUM_POST_NOTIFICATION"
  | "REPLY_COMMENT_FORUM_POST_NOTIFICATION"
  // User-facing notifications about announcements
  | "NEW_ANNOUNCEMENT_NOTIFICATION"
  | "VOTE_ANNOUNCEMENT_NOTIFICATION"
  | "COMMENT_ANNOUNCEMENT_NOTIFICATION"
  | "REPLY_COMMENT_ANNOUNCEMENT_NOTIFICATION"
  // User-facing notifications about reports
  | "REPORT_SUBMITTED_CONFIRMATION"
  | "REPORT_RESOLVED_VIOLATION"
  | "REPORT_RESOLVED_NO_VIOLATION"
  | "YOUR_COMMENT_WAS_DELETED"
  // User-facing notifications about clarifications/messages
  | "MESSAGE_NEW_NOTIFICATION"
  // User-facing notifications about feedback lifecycle
  | "FEEDBACK_SUBMITTED_NOTIFICATION"
  | "FEEDBACK_PROCESSING_NOTIFICATION"
  | "FEEDBACK_RESOLVED_NOTIFICATION"
  | "FEEDBACK_REJECTED_NOTIFICATION"
  // Department staff notifications
  | "NEW_FEEDBACK_RECEIVED"
  | "FEEDBACK_FORWARDED_TO_YOU"
  // Admin notifications
  | "NEW_COMMENT_REPORT_FOR_ADMIN"
  // General/System notifications
  | "ADMIN_NOTIFICATION"
  | "SYSTEM_ANNOUNCEMENT_NOTIFICATION";
export type NotificationDetails = {
  id: string;
  // userId: string;
  content: string;
  notificationType: TypeOfNotification;
  targetId: string;
  isRead: boolean;
  createdAt: string;
};
export interface MarkAsReadPayload {
  ids?: string[];
  all?: boolean;
  isRead?: boolean;
}
