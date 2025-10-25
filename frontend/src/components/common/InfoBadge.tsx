import { cn } from "@/lib/utils";
import { CalendarFold, MapPinHouse, School, Tag } from "lucide-react";
import { Badge } from "../ui/badge";

type StatusBadgeProps = {
  type: "CATEGORY" | "LOCATION" | "DATE" | "DEPARTMENT";
  text: string;
};

const STATUS_CONFIG = {
  CATEGORY: {
    icon: Tag,
    badgeClassName: "text-black/70 bg-neutral-light-primary-200/50",
    iconClassName: "text-yellow-primary-300",
  },
  LOCATION: {
    icon: MapPinHouse,

    badgeClassName: "text-black/70 bg-neutral-light-primary-200/50",
    iconClassName: "text-red-primary-400",
  },
  DATE: {
    icon: CalendarFold,
    badgeClassName: "text-black/70 bg-neutral-light-primary-200/50",
    iconClassName: "text-green-primary-300",
  },
  DEPARTMENT: {
    icon: School,
    badgeClassName: "text-black/70 bg-neutral-light-primary-200/50",
    iconClassName: "text-blue-primary-300",
  },
};

const InfoBadge = ({ type, text }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[type] || STATUS_CONFIG.CATEGORY;
  const { icon: Icon, badgeClassName, iconClassName } = config;
  return (
    <Badge className={cn(badgeClassName, "py-[2px] md:py-1")}>
      {Icon && <Icon className={`${iconClassName} font-bold`} />}
      <span className="ml-[1px] text-[10px] md:text-xs">{text}</span>
    </Badge>
  );
};

export default InfoBadge;
