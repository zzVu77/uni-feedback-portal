import { MessageSquare, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import InfoBadge from "../common/InfoBadge";
import StatusBadge from "../common/StatusBadge";
import { ForumPostListItem } from "@/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { stripHtml } from "@/utils/stripHtml";

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
    <div className="group relative flex w-full flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:scale-101 hover:border-slate-300 hover:shadow-md md:p-6">
      {/* Header: Author Info & Status */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {user.fullName}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
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
        <div className="shrink-0">
          <StatusBadge type={feedback.currentStatus} />
        </div>
      </div>

      {/* Content Section */}
      <Link href={`/forum/posts/${id}`} className="group/title">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900 transition-colors group-hover/title:text-blue-600 md:text-xl">
            {feedback.subject}
          </h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 md:text-base">
            {previewContent}
          </p>
        </div>
      </Link>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <InfoBadge type="CATEGORY" text={feedback.category.name} />
        <InfoBadge type="DEPARTMENT" text={feedback.department.name} />
        {feedback.location && (
          <InfoBadge type="LOCATION" text={feedback.location} />
        )}
      </div>

      {/* Footer: Engagement Bar */}
      <div className="mt-6 flex items-center gap-1 border-t border-slate-50 pt-3 md:gap-4">
        <button
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-slate-50",
            hasVoted ? "bg-blue-50/50 text-blue-600" : "text-slate-600",
          )}
        >
          <ThumbsUp className={cn("h-4 w-4", hasVoted && "fill-current")} />
          <span>{votes}</span>
          <span className="hidden sm:inline">Thích</span>
        </button>
        <Link
          href={`/forum/posts/${id}`}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{commentsCount}</span>
          <span className="hidden sm:inline">Bình luận</span>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
