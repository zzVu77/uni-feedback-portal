"use client";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { FileText, University, User } from "lucide-react"; // Import FileText

export type TypeOfMessageUser = "DEPARTMENT_STAFF" | "STUDENT" | "ADMIN";
const MESSAGE_CONFIG = {
  DEPARTMENT_STAFF: {
    icon: University,
    iconClassName: "text-indigo-600 h-3.5 w-3.5",
    bgStyle: "bg-indigo-100",
  },
  ADMIN: {
    icon: University,
    iconClassName: "text-rose-600 h-3.5 w-3.5",
    bgStyle: "bg-rose-100",
  },
  STUDENT: {
    icon: User,
    iconClassName: "text-slate-600 h-3.5 w-3.5",
    bgStyle: "bg-slate-200",
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

  const senderName = isCurrentUser
    ? "Bạn"
    : user.fullName === "Anonymous"
      ? "Ẩn danh"
      : user.fullName;

  const timeString = new Date(createdAt).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1.5",
        isCurrentUser ? "items-end" : "items-start",
      )}
    >
      {/* Header Info */}
      <div
        className={cn(
          "flex items-center gap-2 px-1 text-xs font-medium",
          isCurrentUser ? "flex-row-reverse" : "flex-row",
        )}
      >
        <span className="flex items-center gap-1.5 text-slate-700">
          {!isCurrentUser && (
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full ${bgStyle}`}
            >
              {Icon && <Icon className={`${iconClassName}`} />}
            </div>
          )}
          {senderName}
        </span>
        <span className="text-[10px] text-slate-400">{timeString}</span>
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[90%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm",
          isCurrentUser
            ? "rounded-[20px] rounded-tr-[4px] bg-indigo-600 text-white"
            : "rounded-[20px] rounded-tl-[4px] border border-slate-200 bg-white text-slate-800",
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>

        {/* --- ATTACHMENTS SECTION --- */}
        {fileAttachments && fileAttachments.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {fileAttachments.map((file, idx) => {
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(
                file.fileUrl || "",
              );
              return (
                <a
                  key={idx}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border p-2 transition-colors",
                    isCurrentUser
                      ? "border-indigo-400 bg-indigo-500/50 hover:bg-indigo-500/80"
                      : "border-slate-100 bg-slate-50 hover:bg-slate-100",
                  )}
                >
                  {isImage ? (
                    <img
                      src={file.fileUrl}
                      alt={file.fileName}
                      className="max-h-[200px] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          isCurrentUser
                            ? "bg-indigo-400 text-white"
                            : "bg-slate-200 text-slate-500",
                        )}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">
                          {file.fileName || "Tệp đính kèm"}
                        </span>
                        <span
                          className={cn(
                            "text-[10px]",
                            isCurrentUser
                              ? "text-indigo-200"
                              : "text-slate-400",
                          )}
                        >
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
