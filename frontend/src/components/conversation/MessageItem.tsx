import { cn } from "@/lib/utils";
import { University, User } from "lucide-react";
type TypeOfUser = "STAFF" | "STUDENT";
const MESSAGE_CONFIG = {
  STAFF: {
    icon: University,
    iconClassName: "text-blue-primary-600 h-4 w-4",
    bgStyle: "bg-blue-primary-100",
  },
  STUDENT: {
    icon: User,
    iconClassName: "text-neutral-dark-primary-700 h-4 w-4",
    bgStyle: "bg-neutral-light-primary-300",
  },
};
type MessageItemProps = {
  typeOfUser: TypeOfUser;
  isReceived: boolean;
  content: string;
  name: string;
  timestamp: string;
};
const MessageItem = ({
  typeOfUser,
  isReceived,
  content,
  name,
  timestamp,
}: MessageItemProps) => {
  const config = MESSAGE_CONFIG[typeOfUser];
  const { icon: Icon, iconClassName, bgStyle } = config;
  return (
    <div
      className={cn(
        "flex w-full max-w-[90%] flex-col gap-1 px-2 py-4 shadow-xs",
        isReceived
          ? "bg-neutral-light-primary-200/30 self-start rounded-tr-[6px] rounded-b-[6px]"
          : "bg-blue-primary-50 self-end rounded-tl-[6px] rounded-b-[6px]",
      )}
    >
      {/* Header */}
      <div className="flex flex-row items-center gap-2">
        <div className={`rounded-full ${bgStyle} p-1`}>
          <Icon className={`${iconClassName}`} />
        </div>
        <span className="text-[14px] font-medium">{name}</span>
        <span className="text-[11px] text-gray-500 before:mx-[2px] before:content-['•']">
          {timestamp}
        </span>
      </div>
      {/* Content */}
      <p className="ml-4 text-[13px]">{content}</p>
    </div>
  );
};

export default MessageItem;
