"use client";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { University, User } from "lucide-react";
export type TypeOfMessageUser = "DEPARTMENT_STAFF" | "STUDENT" | "ADMIN";
const MESSAGE_CONFIG = {
  DEPARTMENT_STAFF: {
    icon: University,
    iconClassName: "text-blue-primary-600 h-4 w-4",
    bgStyle: "bg-blue-primary-100",
  },
  ADMIN: {
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

const MessageItem = ({ content, user, createdAt }: Message) => {
  const { user: currentUser } = useUser();
  const config = MESSAGE_CONFIG[user.role] || MESSAGE_CONFIG.DEPARTMENT_STAFF;
  const { icon: Icon, iconClassName, bgStyle } = config;
  return (
    <div
      className={cn(
        "flex w-full max-w-[90%] flex-col gap-1 px-2 py-4 shadow-xs",
        currentUser?.id === user.id
          ? "bg-blue-primary-50 self-end rounded-tl-[6px] rounded-b-[6px]"
          : "bg-neutral-light-primary-200/30 self-start rounded-tr-[6px] rounded-b-[6px]",
      )}
    >
      {/* Header */}
      <div className="flex flex-row items-center gap-2">
        <div className={`rounded-full ${bgStyle} p-1`}>
          {Icon && <Icon className={`${iconClassName}`} />}
        </div>
        <span className="text-[14px] font-medium">{user.fullName}</span>
        <span className="text-[11px] text-gray-500 before:mx-0.5 before:content-['•']">
          {new Date(createdAt).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>
      {/* Content */}
      <p className="ml-4 text-[13px]">{content}</p>
    </div>
  );
};

export default MessageItem;
