import { cn } from "@/lib/utils";
import { ForumPostListItem } from "@/types";
import { stripHtml } from "@/utils/stripHtml";
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import InfoBadge from "../common/InfoBadge";
import StatusBadge from "../common/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  data: ForumPostListItem;
};

const PostCard = ({ data }: Props) => {
  const { feedback, createdAt, hasVoted, user, votes, commentsCount, id } =
    data;

  const previewContent = useMemo(() => {
    return stripHtml(feedback.description);
  }, [feedback.description]);

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:ring-indigo-500/30 md:p-8">
      {/* Decorative Top Gradient Line */}
      <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-500 via-red-500 to-pink-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Background ambient glow effect */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-50 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header: Author Info & Status */}
      <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 shadow-md ring-2 ring-white transition-transform duration-500 group-hover:scale-110 group-hover:ring-indigo-100">
            <AvatarImage
              src={user?.avatarUrl || "https://github.com/shadcn.png"}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-sm font-bold text-indigo-700">
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[15px] font-extrabold tracking-tight text-slate-800">
              {user.fullName}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="shrink-0 origin-top-right scale-90 sm:scale-100">
          <StatusBadge type={feedback.currentStatus} />
        </div>
      </div>

      {/* Content Section */}
      <Link
        href={`/forum/posts/${id}`}
        className="group/title relative z-10 flex-1"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-xl leading-tight font-extrabold tracking-tight text-slate-900 transition-all duration-300 group-hover/title:bg-gradient-to-r group-hover/title:from-indigo-600 group-hover/title:to-blue-600 group-hover/title:bg-clip-text group-hover/title:text-transparent md:text-2xl">
            {feedback.subject}
          </h2>
          <p className="line-clamp-3 text-[15px] leading-relaxed text-slate-500 md:text-base">
            {previewContent}
          </p>
        </div>
      </Link>

      {/* Tags */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2.5">
        <InfoBadge type="CATEGORY" text={feedback.category.name} />
        <InfoBadge type="DEPARTMENT" text={feedback.department.name} />
        {feedback.location && (
          <InfoBadge type="LOCATION" text={feedback.location} />
        )}
      </div>

      {/* Footer: Engagement Bar */}
      <div className="relative z-10 mt-4 flex items-center gap-3 border-t border-slate-100/80 pt-4">
        <button
          className={cn(
            "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300",
            hasVoted
              ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50 hover:bg-indigo-100"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          )}
        >
          <ThumbsUp
            className={cn(
              "h-4.5 w-4.5 transition-transform duration-300",
              hasVoted ? "scale-110 fill-current" : "group-hover:scale-110",
            )}
          />
          <span>{votes}</span>
          <span className="hidden sm:inline">
            {hasVoted ? "Đã thích" : "Thích"}
          </span>
        </button>
        <Link
          href={`/forum/posts/${id}`}
          className="group/comment flex items-center gap-2 rounded-full bg-slate-50 px-5 py-2 text-sm font-bold text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900"
        >
          <MessageSquare className="h-4.5 w-4.5 transition-transform duration-300 group-hover/comment:scale-110" />
          <span>{commentsCount}</span>
          <span className="hidden sm:inline">Bình luận</span>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
