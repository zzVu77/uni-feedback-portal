/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useUser } from "@/context/UserContext";
import { useMarkNotificationAsRead } from "@/hooks/queries/useNotificationQueries";
import { cn } from "@/lib/utils";
import { NotificationDetails } from "@/types";
import { generateNotificationUrl } from "@/utils/generateNotificationUrl";
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

// Modern Color Palette based on Notification Type
const STYLE_SUCCESS = {
  iconClassName: "text-emerald-600",
  backgroundClassName: "bg-emerald-50 border border-emerald-100",
};

const STYLE_COMMENT = {
  iconClassName: "text-indigo-600",
  backgroundClassName: "bg-indigo-50 border border-indigo-100",
};

const STYLE_ANNOUNCEMENT = {
  iconClassName: "text-amber-600",
  backgroundClassName: "bg-amber-50 border border-amber-100",
};

const STYLE_ALERT = {
  iconClassName: "text-rose-600",
  backgroundClassName: "bg-rose-50 border border-rose-100",
};

const STYLE_SYSTEM = {
  iconClassName: "text-slate-600",
  backgroundClassName: "bg-slate-100 border border-slate-200",
};

export const NOTIFICATION_CONFIG = {
  // -----------------------------
  // 👍 VOTE (SUCCESS/GREEN)
  // -----------------------------
  VOTE_FORUM_POST_NOTIFICATION: {
    title: "Tương tác mới",
    icon: ThumbsUp,
    ...STYLE_SUCCESS,
    defaultDescription: "Ai đó vừa thích bài viết của bạn.",
  },
  VOTE_ANNOUNCEMENT_NOTIFICATION: {
    title: "Tương tác mới",
    icon: ThumbsUp,
    ...STYLE_SUCCESS,
    defaultDescription: "Ai đó vừa thích thông báo của bạn.",
  },

  // -----------------------------
  // 💬 COMMENT / REPLY (BLUE)
  // -----------------------------
  COMMENT_FORUM_POST_NOTIFICATION: {
    title: "Bình luận mới",
    icon: MessageCircleMore,
    ...STYLE_COMMENT,
    defaultDescription: "Có người vừa bình luận vào bài đăng của bạn.",
  },
  REPLY_COMMENT_FORUM_POST_NOTIFICATION: {
    title: "Phản hồi mới",
    icon: MessageSquareReply,
    ...STYLE_COMMENT,
    defaultDescription: "Có người vừa trả lời bình luận của bạn.",
  },
  COMMENT_ANNOUNCEMENT_NOTIFICATION: {
    title: "Bình luận mới",
    icon: MessageCircleMore,
    ...STYLE_COMMENT,
    defaultDescription: "Có người vừa bình luận vào thông báo của bạn.",
  },
  REPLY_COMMENT_ANNOUNCEMENT_NOTIFICATION: {
    title: "Phản hồi mới",
    icon: MessageSquareReply,
    ...STYLE_COMMENT,
    defaultDescription: "Có người vừa trả lời bình luận của bạn.",
  },

  // -----------------------------
  // 📢 ANNOUNCEMENTS (YELLOW)
  // -----------------------------
  NEW_ANNOUNCEMENT_NOTIFICATION: {
    title: "Thông báo mới",
    icon: Bell,
    ...STYLE_ANNOUNCEMENT,
    defaultDescription: "Bạn có một thông báo mới từ hệ thống.",
  },

  // -----------------------------
  // 🚨 REPORT / REJECTION (RED)
  // -----------------------------
  REPORT_SUBMITTED_CONFIRMATION: {
    title: "Báo cáo đã gửi",
    icon: MessageCircleWarning,
    ...STYLE_ALERT,
    defaultDescription: "Báo cáo của bạn đã được tiếp nhận.",
  },
  REPORT_RESOLVED_VIOLATION: {
    title: "Kết quả báo cáo",
    icon: CheckCircle,
    ...STYLE_SUCCESS,
    defaultDescription: "Báo cáo của bạn đã được xác nhận vi phạm.",
  },
  REPORT_RESOLVED_NO_VIOLATION: {
    title: "Kết quả báo cáo",
    icon: XCircle,
    ...STYLE_ALERT,
    defaultDescription: "Nội dung bạn báo cáo không vi phạm.",
  },
  YOUR_COMMENT_WAS_DELETED: {
    title: "Nội dung bị xóa",
    icon: ShieldAlert,
    ...STYLE_ALERT,
    defaultDescription: "Bình luận của bạn bị xóa do vi phạm hướng dẫn.",
  },

  // -----------------------------
  // ✉️ MESSAGES / CLARIFICATION (BLUE)
  // -----------------------------
  MESSAGE_NEW_NOTIFICATION: {
    title: "Tin nhắn mới",
    icon: MessageSquareText,
    ...STYLE_COMMENT,
    defaultDescription: "Bạn có một tin nhắn mới.",
  },
  CLARIFICATION_NEW_NOTIFICATION: {
    title: "Yêu cầu trao đổi",
    icon: MessageSquareText,
    ...STYLE_COMMENT,
    defaultDescription: "Bạn có một yêu cầu làm rõ mới.",
  },
  CLARIFICATION_CLOSED_NOTIFICATION: {
    title: "Trao đổi kết thúc",
    icon: MessageSquareText,
    ...STYLE_SYSTEM,
    defaultDescription: "Yêu cầu làm rõ của bạn đã được đóng.",
  },

  // -----------------------------
  // 📝 FEEDBACK LIFECYCLE
  // -----------------------------
  FEEDBACK_SUBMITTED_NOTIFICATION: {
    title: "Góp ý thành công",
    icon: Send,
    ...STYLE_SUCCESS,
    defaultDescription: "Bạn đã gửi góp ý thành công.",
  },
  FEEDBACK_PROCESSING_NOTIFICATION: {
    title: "Đang xử lý góp ý",
    icon: Hourglass,
    ...STYLE_COMMENT,
    defaultDescription: "Góp ý của bạn đang được xử lý.",
  },
  FEEDBACK_RESOLVED_NOTIFICATION: {
    title: "Góp ý đã hoàn tất",
    icon: CheckCircle,
    ...STYLE_SUCCESS,
    defaultDescription: "Góp ý của bạn đã được phản hồi.",
  },
  FEEDBACK_REJECTED_NOTIFICATION: {
    title: "Góp ý bị từ chối",
    icon: XCircle,
    ...STYLE_ALERT,
    defaultDescription: "Góp ý của bạn không được chấp nhận.",
  },

  // -----------------------------
  // 🏢 DEPARTMENT STAFF
  // -----------------------------
  NEW_FEEDBACK_RECEIVED: {
    title: "Góp ý mới",
    icon: MessageCircle,
    ...STYLE_COMMENT,
    defaultDescription: "Bạn vừa nhận một góp ý mới từ người dùng.",
  },
  FEEDBACK_FORWARDED_TO_YOU: {
    title: "Điều hướng góp ý",
    icon: MessageCircleMore,
    ...STYLE_COMMENT,
    defaultDescription: "Một góp ý đã được chuyển đến bạn để xử lý.",
  },
  FEEDBACK_FORWARDED: {
    title: "Điều hướng góp ý",
    icon: MessageCircleMore,
    ...STYLE_COMMENT,
    defaultDescription: "Góp ý đã được chuyển đến phòng ban khác để xử lý.",
  },

  // -----------------------------
  // 🔧 ADMIN
  // -----------------------------
  NEW_COMMENT_REPORT_FOR_ADMIN: {
    title: "Báo cáo vi phạm",
    icon: ShieldAlert,
    ...STYLE_ALERT,
    defaultDescription: "Có một báo cáo bình luận cần được xem xét.",
  },
  ADMIN_NOTIFICATION: {
    title: "Từ Quản trị viên",
    icon: ShieldAlert,
    ...STYLE_ALERT,
    defaultDescription: "Quản trị viên vừa gửi thông báo đến bạn.",
  },

  // -----------------------------
  // 🖥️ SYSTEM
  // -----------------------------
  SYSTEM_ANNOUNCEMENT_NOTIFICATION: {
    title: "Hệ thống",
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
  content,
  // title: messageTitle,
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
  const { user } = useUser();
  const notificationUrl = generateNotificationUrl(
    notificationType,
    targetId,
    user?.role || "STUDENT",
  );
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const handleItemClick = () => {
    if (!isRead) {
      markAsRead({ ids: [id] });
    }
  };

  return (
    <Link
      href={notificationUrl}
      key={id}
      onClick={handleItemClick}
      className={cn(
        "group flex w-full items-center gap-4 border-b border-white/40 p-4 transition-all duration-300 hover:bg-indigo-50/40",
        !isRead && "bg-indigo-50/60",
      )}
    >
      {/* Left: Icon Container */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105",
          backgroundClassName,
        )}
      >
        {Icon && <Icon className={cn("h-6 w-6", iconClassName)} />}
      </div>

      {/* Middle: Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[15px] font-bold transition-colors group-hover:text-indigo-700",
              isRead ? "text-slate-700" : "text-slate-900",
            )}
          >
            {title}
          </span>
          <span className="text-[12px] font-medium text-slate-400">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">
          <span className="font-medium text-slate-700">
            {/* {messageTitle ? `"${messageTitle}": ` : ""} */}
          </span>
          {content ?? defaultDescription}
        </p>
      </div>

      {/* Right: Unread Indicator */}
      {!isRead && (
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
      )}
    </Link>
  );
};

export default NotificationItem;
