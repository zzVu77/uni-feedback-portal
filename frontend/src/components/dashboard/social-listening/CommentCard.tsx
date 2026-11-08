"use client";

import { cn } from "@/lib/utils";
import { PostCommentItem } from "@/types/social-listening";
import { format } from "date-fns";
import { CornerDownRight, Flame, ThumbsUp } from "lucide-react";
import React from "react";

interface CommentCardProps {
  comment: PostCommentItem;
  className?: string;
}

const getCommentSentimentBadge = (label: string) => {
  switch (label) {
    case "Tiêu cực":
    case "Bức xúc":
      return {
        text: label,
        classes: "bg-rose-50 text-rose-700 border-rose-200",
      };
    case "Stress lo âu":
      return {
        text: label,
        classes: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "Tích cực":
      return {
        text: label,
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "Trung lập":
    default:
      return {
        text: label || "Trung lập",
        classes: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
};

const getAvatarColor = (name: string) => {
  const colors = [
    "from-indigo-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  className,
}) => {
  const sentiment = getCommentSentimentBadge(comment.sentimentLabel);
  const isReply = Boolean(comment.parentCommentId);
  const initial = comment.author ? comment.author.charAt(0).toUpperCase() : "U";
  const avatarGradient = getAvatarColor(comment.author || "User");

  let formattedDate = "";
  try {
    formattedDate = format(new Date(comment.commentedAt), "dd/MM/yyyy HH:mm");
  } catch {
    formattedDate = comment.commentedAt;
  }

  return (
    <div
      className={cn(
        "group relative rounded-xl border p-3.5 transition-all duration-200",
        comment.isTopConcern
          ? "border-rose-300 bg-rose-50/30 shadow-xs ring-1 ring-rose-200/50"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs",
        isReply ? "ml-5 border-l-2 border-l-indigo-300/80 pl-4" : "",
        className,
      )}
    >
      {/* Nested reply indicator */}
      {isReply && (
        <div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-indigo-600">
          <CornerDownRight className="h-3 w-3 shrink-0" />
          <span>Bình luận trả lời (nested reply)</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {/* Avatar */}
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-xs",
              avatarGradient,
            )}
          >
            {initial}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-xs font-bold text-slate-800">
                {comment.author || "Người dùng ẩn danh"}
              </span>

              <span className="text-[10px] text-slate-400">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex shrink-0 items-center gap-1.5">
          {comment.isTopConcern && (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800"
              title="Bình luận nêu bằng chứng cụ thể hoặc phản ánh bức xúc cao"
            >
              <Flame className="h-3 w-3 animate-pulse text-rose-600" />
              Bức xúc trọng điểm
            </span>
          )}

          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              sentiment.classes,
            )}
          >
            {sentiment.text}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-2 pl-9.5 text-xs leading-relaxed break-words whitespace-pre-wrap text-slate-700">
        {comment.content}
      </div>

      {/* Footer: Likes */}
      <div className="mt-2.5 flex items-center justify-end gap-3 pl-9.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 font-medium text-slate-600">
          <ThumbsUp className="h-3 w-3 text-blue-500" />
          <span>{comment.reactionCount}</span>
        </div>
      </div>
    </div>
  );
};
