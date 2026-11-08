"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  CornerDownRight,
  Flame,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PostCommentItem } from "@/types/social-listening";

interface CommentCardProps {
  comment: PostCommentItem;
  depth?: number;
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
    case "Chưa phân tích":
      return {
        text: "Chưa phân tích",
        classes:
          "bg-slate-50 text-slate-500 border-slate-200 border-dashed font-normal",
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
  depth = 0,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const sentiment = getCommentSentimentBadge(comment.sentimentLabel);
  const isReply = depth > 0 || Boolean(comment.parentCommentId);
  const initial = comment.author ? comment.author.charAt(0).toUpperCase() : "U";
  const avatarGradient = getAvatarColor(comment.author || "User");
  const hasReplies = Boolean(comment.replies && comment.replies.length > 0);
  const repliesCount = comment.replies?.length || 0;

  let formattedDate = "";
  try {
    formattedDate = format(new Date(comment.commentedAt), "dd/MM/yyyy HH:mm");
  } catch {
    formattedDate = comment.commentedAt;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Current Comment Box */}
      <div
        className={cn(
          "group relative rounded-xl border transition-all duration-200",
          depth === 0
            ? "border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300"
            : depth === 1
              ? "border-slate-200/80 bg-slate-50/70 p-3.5"
              : "border-slate-200/60 bg-white/90 p-3",
          comment.isTopConcern &&
            "border-rose-300 bg-rose-50/40 shadow-xs ring-1 ring-rose-200/50",
        )}
      >
        {/* Reply to Author Indicator */}
        {isReply && (
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <CornerDownRight className="h-3 w-3 shrink-0 text-indigo-500" />
            <span>
              Phản hồi{" "}
              {comment.replyToAuthor ? (
                <span className="font-bold text-indigo-600">
                  @{comment.replyToAuthor}
                </span>
              ) : (
                <span className="font-medium text-slate-600">
                  bình luận trên
                </span>
              )}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            {/* Avatar */}
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-xs",
                depth === 0 ? "h-8 w-8 text-xs" : "h-6 w-6 text-[10px]",
                avatarGradient,
              )}
            >
              {initial}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "truncate font-bold text-slate-800",
                    depth === 0 ? "text-sm" : "text-xs",
                  )}
                >
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

        {/* Comment Content */}
        <div
          className={cn(
            "mt-2 text-xs leading-relaxed break-words whitespace-pre-wrap text-slate-700 sm:text-[13px]",
            depth === 0 ? "pl-10.5" : "pl-8.5",
          )}
        >
          {comment.content}
        </div>

        {/* Footer: Likes & Toggle Replies Button */}
        <div
          className={cn(
            "mt-2.5 flex items-center justify-between border-t border-slate-100/70 pt-2",
            depth === 0 ? "pl-10.5" : "pl-8.5",
          )}
        >
          {/* Toggle Nested Replies Button */}
          {hasReplies ? (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 transition-colors hover:text-indigo-800 hover:underline"
            >
              <MessageSquare className="h-3 w-3" />
              <span>
                {isExpanded
                  ? `Ẩn ${repliesCount} phản hồi`
                  : `Xem ${repliesCount} phản hồi`}
              </span>
              {isExpanded ? (
                <ChevronUp className="ml-0.5 h-3 w-3" />
              ) : (
                <ChevronDown className="ml-0.5 h-3 w-3" />
              )}
            </button>
          ) : (
            <div />
          )}

          {/* Reactions Count */}
          <div className="flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            <ThumbsUp className="h-3 w-3 text-blue-500" />
            <span>{comment.reactionCount}</span>
          </div>
        </div>
      </div>

      {/* Recursive Render of Nested Replies */}
      {hasReplies && isExpanded && (
        <div
          className={cn(
            "mt-2.5 space-y-2.5 border-l-2",
            depth === 0
              ? "ml-4 border-indigo-200/80 pl-3 sm:ml-6 sm:pl-4"
              : depth === 1
                ? "ml-3 border-indigo-100/90 pl-2.5 sm:ml-5 sm:pl-3"
                : "ml-2.5 border-slate-200/80 pl-2",
          )}
        >
          {comment.replies!.map((reply) => (
            <CommentCard
              key={reply.id || reply.commentId}
              comment={reply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
