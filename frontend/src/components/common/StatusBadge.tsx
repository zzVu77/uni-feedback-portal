import {
  CircleAlert,
  CircleCheckBig,
  CircleX,
  Forward,
  Loader,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export type StatusBadgeProps = {
  type:
    | "PENDING"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "REJECTED"
    | "CLOSED"
    | "FORWARDED"
    | "OPENING";
};

const STATUS_CONFIG = {
  PENDING: {
    text: "Đang chờ tiếp nhận",
    icon: CircleAlert,
    badgeClassName:
      "text-yellow-primary-500 bg-yellow-primary-100 hover:bg-yellow-primary-200/35",
    iconClassName: "text-yellow-primary-300 animate-pulse",
    textClassName: "",
  },
  IN_PROGRESS: {
    text: "Đang xử lý",
    icon: Loader,
    badgeClassName:
      "text-blue-primary-700 bg-blue-primary-100 hover:bg-blue-primary-200/80",
    iconClassName: "text-blue-primary-300 animate-pulse",
    textClassName: "",
  },
  RESOLVED: {
    text: "Đã xử lý",
    icon: CircleCheckBig,
    badgeClassName:
      "text-green-primary-500 bg-green-primary-100 hover:bg-green-primary-200/35 ",
    iconClassName: "text-green-primary-300 animate-pulse ",
    textClassName: "",
  },
  REJECTED: {
    text: "Từ chối",
    icon: CircleX,
    badgeClassName:
      "text-red-primary-500 bg-red-primary-300 hover:bg-red-primary-500/25 ",
    iconClassName: "text-red-primary-400 animate-pulse",
    textClassName: "",
  },
  CLOSED: {
    text: "Đã đóng",
    icon: null,
    badgeClassName:
      "text-red-primary-500 bg-red-primary-300 py-1 gap-0 rounded-3xl py-0.5",
    iconClassName: "",
    textClassName: "text-[10px]",
  },
  OPENING: {
    text: "Đang mở",
    icon: null,
    badgeClassName:
      "text-green-primary-500 bg-green-primary-100 py-1 gap-0 rounded-3xl py-0.5",
    iconClassName: "",
    textClassName: "text-[10px]",
  },
  FORWARDED: {
    text: "Được chuyển tiếp",
    icon: Forward,
    badgeClassName: "text-purple-800 bg-purple-200/60 hover:bg-purple-200 ",
    iconClassName: "text-purple-800 animate-pulse",
    textClassName: "",
  },
};

const StatusBadge = ({ type }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[type] || STATUS_CONFIG.PENDING;
  const { text, icon: Icon, badgeClassName, iconClassName } = config;
  return (
    <Badge className={cn("py-1", badgeClassName)}>
      {Icon && <Icon className={`${iconClassName} font-bold`} />}
      <span className={cn("ml-px", "text-[12px]", config.textClassName)}>
        {text}
      </span>
    </Badge>
  );
};

export default StatusBadge;
