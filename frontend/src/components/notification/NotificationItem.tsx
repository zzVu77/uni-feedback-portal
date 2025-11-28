/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cn } from "@/lib/utils";
import {
  Bell,
  CheckCircle,
  Hourglass,
  MessageCircle,
  MessageCircleMore,
  MessageCircleWarning,
  MessageSquareReply,
  MessageSquareText,
  Send,
  ShieldAlert,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "../../utils/formatDistanceToNow";
import { TypeOfNotification } from "@/types";
type NotificationType = {
  type: TypeOfNotification;
  title?: string;
  description?: string;
  isRead?: boolean;
  time: string;
};

export const NOTIFICATION_CONFIG = {
  VOTE_POST_NOTIFICATION: {
    title: "Bài viết của bạn được thích",
    icon: ThumbsUp,
    iconClassName: "text-green-600/60",
    backgroundClassName: "bg-green-100/80",
    defaultDescription: "Ai đó vừa thích bài viết của bạn.",
  },
  VOTE_COMMENT_NOTIFICATION: {
    title: "Bình luận của bạn được thích",
    icon: ThumbsUp,
    iconClassName: "text-green-600/60",
    backgroundClassName: "bg-green-100/80",
    defaultDescription: "Ai đó vừa thích bình luận của bạn.",
  },
  COMMENT_POST_NOTIFICATION: {
    title: "Bình luận mới trong bài viết",
    icon: MessageCircleMore,
    iconClassName: "text-blue-600/60",
    backgroundClassName: "bg-blue-100/80",
    defaultDescription: "Có người vừa bình luận vào bài viết của bạn.",
  },
  REPLY_COMMENT_NOTIFICATION: {
    title: "Phản hồi mới trong bình luận",
    icon: MessageSquareReply,
    iconClassName: "text-blue-600/60",
    backgroundClassName: "bg-blue-100/80",
    defaultDescription: "Có người vừa trả lời bình luận của bạn.",
  },

  REPORT_COMMENT_NOTIFICATION: {
    title: "Bình luận bị báo cáo",
    icon: MessageCircleWarning,
    iconClassName: "text-red-600/60",
    backgroundClassName: "bg-red-100/80",
    defaultDescription: "Bình luận của bạn đã bị người dùng khác báo cáo.",
  },

  MESSAGE_NEW_NOTIFICATION: {
    title: "Tin nhắn mới",
    icon: MessageSquareText,
    iconClassName: "text-purple-600/60",
    backgroundClassName: "bg-purple-100/80",
    defaultDescription: "Bạn có một tin nhắn mới từ người dùng khác.",
  },

  MESSAGE_SYSTEM_NOTIFICATION: {
    title: "Tin nhắn hệ thống",
    icon: Bell,
    iconClassName: "text-purple-700/60",
    backgroundClassName: "bg-purple-50/80",
    defaultDescription: "Bạn nhận được thông báo từ hệ thống.",
  },

  FEEDBACK_SUBMITTED_NOTIFICATION: {
    title: "Góp ý đã được gửi",
    icon: Send,
    iconClassName: "text-yellow-500/70",
    backgroundClassName: "bg-yellow-50/80",
    defaultDescription: "Góp ý của bạn đã được gửi đến hệ thống.",
  },
  FEEDBACK_RECEIVED_NOTIFICATION: {
    title: "Góp ý được tiếp nhận",
    icon: CheckCircle,
    iconClassName: "text-yellow-600/70",
    backgroundClassName: "bg-yellow-100/80",
    defaultDescription: "Phòng ban đã tiếp nhận góp ý của bạn.",
  },
  FEEDBACK_PROCESSING_NOTIFICATION: {
    title: "Góp ý đang được xử lý",
    icon: Hourglass,
    iconClassName: "text-blue-600/70",
    backgroundClassName: "bg-blue-100/80",
    defaultDescription: "Góp ý của bạn đang trong quá trình xử lý.",
  },
  FEEDBACK_RESOLVED_NOTIFICATION: {
    title: "Góp ý đã được xử lý",
    icon: CheckCircle,
    iconClassName: "text-green-600/70",
    backgroundClassName: "bg-green-100/80",
    defaultDescription: "Phòng ban đã xử lý và phản hồi góp ý của bạn.",
  },
  FEEDBACK_REJECTED_NOTIFICATION: {
    title: "Góp ý bị từ chối",
    icon: XCircle,
    iconClassName: "text-red-600/70",
    backgroundClassName: "bg-red-100/80",
    defaultDescription: "Góp ý của bạn không được chấp nhận xử lý.",
  },
  FEEDBACK_COMMENT_NOTIFICATION: {
    title: "Phản hồi mới trong góp ý",
    icon: MessageCircle,
    iconClassName: "text-yellow-600/70",
    backgroundClassName: "bg-yellow-100/80",
    defaultDescription: "Có phản hồi mới về góp ý bạn đã gửi.",
  },

  // ⚙️ --- SYSTEM NOTIFICATIONS ---
  SYSTEM_ANNOUNCEMENT_NOTIFICATION: {
    title: "Thông báo từ hệ thống",
    icon: Bell,
    iconClassName: "text-gray-700/60",
    backgroundClassName: "bg-gray-100/80",
    defaultDescription: "Có thông báo quan trọng từ hệ thống.",
  },
  ADMIN_NOTIFICATION: {
    title: "Thông báo từ quản trị viên",
    icon: ShieldAlert,
    iconClassName: "text-blue-800/70",
    backgroundClassName: "bg-blue-50/80",
    defaultDescription: "Bạn nhận được thông báo trực tiếp từ quản trị viên.",
  },
};

const NotificationItem = ({ type, isRead, time }: NotificationType) => {
  const config =
    NOTIFICATION_CONFIG[type] ||
    NOTIFICATION_CONFIG.SYSTEM_ANNOUNCEMENT_NOTIFICATION;
  const {
    icon: Icon,
    title,
    iconClassName,
    backgroundClassName,
    defaultDescription,
  } = config;

  return (
    <div
      className={cn(
        "flex w-full cursor-pointer flex-row items-start justify-between gap-4 rounded-xl p-4 shadow-sm transition-shadow duration-200 hover:shadow-md",
        isRead ? "bg-white" : "bg-blue-primary-100/40",
      )}
    >
      <div className="flex w-full flex-row items-center justify-start gap-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            backgroundClassName,
          )}
        >
          {Icon && <Icon className={`${iconClassName} font-bold`} />}
        </div>
        <div className="w-full">
          {/* Title */}
          <h4 className="text-[16px] font-medium">
            {title ?? "Notification Title"}
          </h4>
          {/* Description */}
          <p className="mt-1 text-sm text-gray-600">
            {defaultDescription ?? " This is a notification."}
          </p>
        </div>
      </div>
      <div className="block w-20 text-right text-xs text-gray-500">
        {formatDistanceToNow(new Date(time), { addSuffix: true })}
      </div>
    </div>
  );
};

export default NotificationItem;
