"use client";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { FileText, University, User } from "lucide-react"; // Import FileText

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

const MessageItem = ({
  content,
  user,
  createdAt,
  attachments: fileAttachments,
}: Message) => {
  const { user: currentUser } = useUser();
  // Safe access to role config, default to STAFF if role not found
  const config =
    MESSAGE_CONFIG[user.role as keyof typeof MESSAGE_CONFIG] ||
    MESSAGE_CONFIG.DEPARTMENT_STAFF;
  const { icon: Icon, iconClassName, bgStyle } = config;
  const isCurrentUser = currentUser?.id === user.id;

  return (
    <div
      className={cn(
        "flex w-fit max-w-[90%] flex-col gap-1 px-3 py-3 shadow-sm", // Adjusted padding
        isCurrentUser
          ? "self-end rounded-tl-[12px] rounded-br-[2px] rounded-bl-[12px] bg-blue-50" // Adjusted border-radius
          : "self-start rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] bg-gray-50/80", // Adjusted border-radius
      )}
    >
      {/* Header */}
      <div className="mb-1 flex flex-row items-center gap-2">
        <div className={`rounded-full ${bgStyle} p-1`}>
          {Icon && <Icon className={`${iconClassName}`} />}
        </div>
        <span className="text-[13px] font-semibold text-neutral-800">
          {isCurrentUser
            ? "Bạn"
            : user.fullName === "Anonymous"
              ? "Ẩn danh"
              : user.fullName}
        </span>
        <span className="text-[10px] text-gray-400 before:mx-1 before:content-['•']">
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
      <div className="ml-1 flex flex-col gap-2">
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-neutral-700">
          {content}
        </p>

        {/* --- ATTACHMENTS SECTION --- */}
        {fileAttachments && fileAttachments.length > 0 && (
          <div className="mt-1 flex flex-col gap-1">
            {fileAttachments.map((file, idx) => (
              <a
                key={idx}
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white p-2 text-sm transition-colors hover:bg-neutral-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-neutral-100 text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs font-medium text-blue-600">
                    {file.fileName}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
