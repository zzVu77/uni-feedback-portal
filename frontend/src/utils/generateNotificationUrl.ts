import { TypeOfNotification } from "@/types";

const FEEDBACK_GROUP_NOTIFICATIONS: TypeOfNotification[] = [
  "FEEDBACK_SUBMITTED_NOTIFICATION",
  "FEEDBACK_PROCESSING_NOTIFICATION",
  "FEEDBACK_RESOLVED_NOTIFICATION",
  "FEEDBACK_REJECTED_NOTIFICATION",
  "NEW_FEEDBACK_RECEIVED",
  "FEEDBACK_FORWARDED_TO_YOU",
  "NEW_FEEDBACK_RECEIVED",
  "MESSAGE_NEW_NOTIFICATION", //TODO: TargetId of this type is not feedback id
];
const ANNOUNCEMENT_GROUP_NOTIFICATIONS: TypeOfNotification[] = [
  "NEW_ANNOUNCEMENT_NOTIFICATION",
  "COMMENT_ANNOUNCEMENT_NOTIFICATION",
  "REPLY_COMMENT_ANNOUNCEMENT_NOTIFICATION",
];
const FORUM_POST_GROUP_NOTIFICATIONS: TypeOfNotification[] = [
  "VOTE_FORUM_POST_NOTIFICATION",
  "COMMENT_FORUM_POST_NOTIFICATION",
  "REPLY_COMMENT_FORUM_POST_NOTIFICATION",
];
const REPORT_GROUP_NOTIFICATIONS: TypeOfNotification[] = [
  "NEW_COMMENT_REPORT_FOR_ADMIN",
];
export const generateNotificationUrl = (
  notificationType: TypeOfNotification,
  id: string,
  role: "ADMIN" | "DEPARTMENT_STAFF" | "STUDENT",
): string => {
  let baseUrl: string;
  switch (role) {
    case "ADMIN":
      baseUrl = "/admin";
      break;
    case "DEPARTMENT_STAFF":
      baseUrl = "/staff";
      break;
    case "STUDENT":
      baseUrl = "/student";
      break;
    default:
      baseUrl = "";
      break;
  }
  if (
    FEEDBACK_GROUP_NOTIFICATIONS.includes(notificationType) &&
    role === "STUDENT"
  ) {
    return `${baseUrl}/my-feedbacks/${id}`;
  }
  if (
    FEEDBACK_GROUP_NOTIFICATIONS.includes(notificationType) &&
    role === "DEPARTMENT_STAFF"
  ) {
    return `${baseUrl}/list-feedbacks/${id}`;
  }
  if (
    FEEDBACK_GROUP_NOTIFICATIONS.includes(notificationType) &&
    role === "ADMIN"
  ) {
    return `${baseUrl}/feedbacks-management/${id}`;
  }

  if (ANNOUNCEMENT_GROUP_NOTIFICATIONS.includes(notificationType)) {
    return `forum/announcements/${id}`;
  }
  if (FORUM_POST_GROUP_NOTIFICATIONS.includes(notificationType)) {
    return `forum/posts/${id}`;
  }
  if (REPORT_GROUP_NOTIFICATIONS.includes(notificationType)) {
    return `/admin/reported-comment-management?id=${id}&open=true`;
  }
  return "/";
};
