import { CircleAlert, CircleCheckBig, CircleX, Clock3 } from "lucide-react";
import { Badge } from "../ui/badge";

type StatusBadgeProps = {
  type: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED" | "CLOSED";
};

const STATUS_CONFIG = {
  PENDING: {
    text: "Đang chờ tiếp nhận",
    icon: CircleAlert,
    badgeClassName: "text-yellow-primary-500 bg-yellow-primary-100 py-1",
    iconClassName: "text-yellow-primary-300",
  },
  IN_PROGRESS: {
    text: "Đang xử lý",
    icon: Clock3,
    badgeClassName: "text-blue-primary-700 bg-blue-primary-100 py-1",
    iconClassName: "text-blue-primary-300",
  },
  RESOLVED: {
    text: "Đã xử lý",
    icon: CircleCheckBig,
    badgeClassName: "text-green-primary-500 bg-green-primary-100 py-1",
    iconClassName: "text-green-primary-300",
  },
  REJECTED: {
    text: "Từ chối",
    icon: CircleX,
    badgeClassName: "text-red-primary-500 bg-red-primary-300 py-1",
    iconClassName: "text-red-primary-400",
  },
  CLOSED: {
    text: "Đã đóng",
    icon: null,
    badgeClassName:
      "text-red-primary-500 bg-red-primary-300 py-1 gap-0 rounded-3xl",
    iconClassName: "text-red-primary-400 h-5 w-5",
  },
};

const StatusBadge = ({ type }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[type] || STATUS_CONFIG.PENDING;
  const { text, icon: Icon, badgeClassName, iconClassName } = config;
  return (
    <Badge className={badgeClassName}>
      {Icon && <Icon className={`${iconClassName} font-bold`} />}
      <span className="ml-1">{text}</span>
    </Badge>
  );
};

export default StatusBadge;
