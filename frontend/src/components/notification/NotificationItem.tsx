/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cn } from "@/lib/utils";
import { NotificationDetails } from "@/types";
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
import Link from "next/link";
import { formatDistanceToNow } from "../../utils/formatDistanceToNow";

const STYLE_GREEN = {
  iconClassName: "text-green-600/60",
  backgroundClassName: "bg-green-100/80",
};

const STYLE_BLUE = {
  iconClassName: "text-blue-600/60",
  backgroundClassName: "bg-blue-100/80",
};

const STYLE_PURPLE = {
  iconClassName: "text-purple-700/60",
  backgroundClassName: "bg-purple-100/80",
};

const STYLE_PURPLE_LIGHT = {
  iconClassName: "text-purple-600/60",
  backgroundClassName: "bg-purple-100/80",
};

const STYLE_RED = {
  iconClassName: "text-red-600/60",
  backgroundClassName: "bg-red-100/80",
};

const STYLE_YELLOW = {
  iconClassName: "text-yellow-600/70",
  backgroundClassName: "bg-yellow-50/80",
};

const STYLE_GREEN_FEEDBACK = {
  iconClassName: "text-green-600/70",
  backgroundClassName: "bg-green-100/80",
};

const STYLE_BLUE_FEEDBACK = {
  iconClassName: "text-blue-600/70",
  backgroundClassName: "bg-blue-100/80",
};

const STYLE_BLUE_ADMIN = {
  iconClassName: "text-blue-800/70",
  backgroundClassName: "bg-blue-50/80",
};

const STYLE_SYSTEM = {
  iconClassName: "text-gray-700/60",
  backgroundClassName: "bg-gray-100/80",
};
export const NOTIFICATION_CONFIG = {
  // -----------------------------
  // 👍 VOTE (GREEN)
  // -----------------------------
  VOTE_FORUM_POST_NOTIFICATION: {
    title: "Bài viết của bạn được thích",
    icon: ThumbsUp,
    ...STYLE_GREEN,
    defaultDescription: "Ai đó vừa thích bài viết của bạn.",
  },

  VOTE_ANNOUNCEMENT_NOTIFICATION: {
    title: "Thông báo của bạn được thích",
    icon: ThumbsUp,
    ...STYLE_GREEN,
    defaultDescription: "Ai đó vừa thích thông báo của bạn.",
  },

  // -----------------------------
  // 💬 COMMENT / REPLY (BLUE)
  // -----------------------------
  COMMENT_FORUM_POST_NOTIFICATION: {
    title: "Bình luận mới trong bài viết",
    icon: MessageCircleMore,
    ...STYLE_BLUE,
    defaultDescription: "Có người vừa bình luận vào bài viết của bạn.",
  },

  REPLY_COMMENT_FORUM_POST_NOTIFICATION: {
    title: "Phản hồi mới trong bình luận",
    icon: MessageSquareReply,
    ...STYLE_BLUE,
    defaultDescription: "Có người vừa trả lời bình luận của bạn.",
  },

  COMMENT_ANNOUNCEMENT_NOTIFICATION: {
    title: "Bình luận mới trong thông báo",
    icon: MessageCircleMore,
    ...STYLE_BLUE,
    defaultDescription: "Có người vừa bình luận vào thông báo của bạn.",
  },

  REPLY_COMMENT_ANNOUNCEMENT_NOTIFICATION: {
    title: "Phản hồi mới trong thông báo",
    icon: MessageSquareReply,
    ...STYLE_BLUE,
    defaultDescription: "Có người vừa trả lời bình luận của bạn.",
  },

  // -----------------------------
  // 📢 ANNOUNCEMENTS (PURPLE)
  // -----------------------------
  NEW_ANNOUNCEMENT_NOTIFICATION: {
    title: "Thông báo mới",
    icon: Bell,
    ...STYLE_PURPLE,
    defaultDescription: "Bạn có một thông báo mới từ hệ thống.",
  },

  // -----------------------------
  // 🚨 REPORT (RED)
  // -----------------------------
  REPORT_SUBMITTED_CONFIRMATION: {
    title: "Báo cáo đã được gửi",
    icon: MessageCircleWarning,
    ...STYLE_RED,
    defaultDescription: "Báo cáo của bạn đã được tiếp nhận.",
  },

  REPORT_RESOLVED_VIOLATION: {
    title: "Báo cáo hợp lệ",
    icon: CheckCircle,
    ...STYLE_RED,
    defaultDescription: "Báo cáo của bạn đã được xác nhận vi phạm.",
  },

  REPORT_RESOLVED_NO_VIOLATION: {
    title: "Không phát hiện vi phạm",
    icon: XCircle,
    ...STYLE_RED,
    defaultDescription: "Nội dung bạn báo cáo không vi phạm.",
  },

  YOUR_COMMENT_WAS_DELETED: {
    title: "Bình luận đã bị xóa",
    icon: ShieldAlert,
    ...STYLE_RED,
    defaultDescription: "Bình luận của bạn bị xóa do vi phạm hướng dẫn.",
  },

  // -----------------------------
  // ✉️ MESSAGES (PURPLE LIGHT)
  // -----------------------------
  MESSAGE_NEW_NOTIFICATION: {
    title: "Tin nhắn mới",
    icon: MessageSquareText,
    ...STYLE_PURPLE_LIGHT,
    defaultDescription: "Bạn có một tin nhắn mới.",
  },

  // -----------------------------
  // 📝 FEEDBACK LIFECYCLE
  // -----------------------------
  FEEDBACK_SUBMITTED_NOTIFICATION: {
    title: "Góp ý đã được gửi",
    icon: Send,
    ...STYLE_YELLOW,
    defaultDescription: "Bạn đã gửi góp ý thành công.",
  },

  FEEDBACK_PROCESSING_NOTIFICATION: {
    title: "Góp ý đang được xử lý",
    icon: Hourglass,
    ...STYLE_BLUE_FEEDBACK,
    defaultDescription: "Góp ý của bạn đang được xử lý.",
  },

  FEEDBACK_RESOLVED_NOTIFICATION: {
    title: "Góp ý đã được xử lý",
    icon: CheckCircle,
    ...STYLE_GREEN_FEEDBACK,
    defaultDescription: "Góp ý của bạn đã được phản hồi.",
  },

  FEEDBACK_REJECTED_NOTIFICATION: {
    title: "Góp ý bị từ chối",
    icon: XCircle,
    ...STYLE_RED,
    defaultDescription: "Góp ý của bạn không được chấp nhận.",
  },

  // -----------------------------
  // 🏢 DEPARTMENT STAFF
  // -----------------------------
  NEW_FEEDBACK_RECEIVED: {
    title: "Có góp ý mới",
    icon: MessageCircle,
    ...STYLE_BLUE_ADMIN,
    defaultDescription: "Bạn vừa nhận một góp ý mới từ người dùng.",
  },

  FEEDBACK_FORWARDED_TO_YOU: {
    title: "Góp ý được chuyển đến bạn",
    icon: MessageCircleMore,
    ...STYLE_BLUE_ADMIN,
    defaultDescription: "Một góp ý đã được chuyển đến bạn để xử lý.",
  },

  // -----------------------------
  // 🔧 ADMIN
  // -----------------------------
  NEW_COMMENT_REPORT_FOR_ADMIN: {
    title: "Báo cáo bình luận mới",
    icon: ShieldAlert,
    ...STYLE_BLUE_ADMIN,
    defaultDescription: "Có một báo cáo bình luận cần được xem xét.",
  },

  ADMIN_NOTIFICATION: {
    title: "Thông báo từ quản trị viên",
    icon: ShieldAlert,
    ...STYLE_BLUE_ADMIN,
    defaultDescription: "Quản trị viên vừa gửi thông báo đến bạn.",
  },

  // -----------------------------
  // 🖥️ SYSTEM
  // -----------------------------
  SYSTEM_ANNOUNCEMENT_NOTIFICATION: {
    title: "Thông báo hệ thống",
    icon: Bell,
    ...STYLE_SYSTEM,
    defaultDescription: "Bạn nhận được thông báo từ hệ thống.",
  },
};

const NotificationItem = ({
  isRead,
  createdAt,
  notificationType,
  targetId,
  id,
}: NotificationDetails) => {
  const config =
    NOTIFICATION_CONFIG[notificationType] ||
    NOTIFICATION_CONFIG.SYSTEM_ANNOUNCEMENT_NOTIFICATION;
  const {
    icon: Icon,
    title,
    iconClassName,
    backgroundClassName,
    defaultDescription,
  } = config;

  return (
    <Link href={`/notification/${targetId}`} key={id}>
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
            <p className="mt-1 text-sm text-gray-600">{defaultDescription}</p>
          </div>
        </div>
        <div className="block w-20 text-right text-xs text-gray-500">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </div>
      </div>
    </Link>
  );
};

export default NotificationItem;
