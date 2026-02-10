import { MessageSquare, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import InfoBadge from "../common/InfoBadge";
import StatusBadge from "../common/StatusBadge";
import { Separator } from "../ui/separator";
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
    <div className="flex w-full flex-col gap-3 rounded-xl bg-white px-3 py-4 shadow-sm transition-shadow duration-200 hover:scale-101 md:px-4">
      <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-0">
        {/* Post Title */}
        <Link href={`/forum/posts/${id}`}>
          <h2 className="text-md hover:text-blue-primary-300 max-w-[300px] truncate font-semibold md:max-w-lg md:text-[16px] lg:text-xl">
            {feedback.subject}
          </h2>
        </Link>
        <StatusBadge type={feedback.currentStatus} />
      </div>
      {/* Post Short Content */}
      <h3 className="lg:text-md text-neutral-dark-primary-600 line-clamp-2 text-sm font-normal">
        {previewContent}
      </h3>
      {/* Tags */}
      <div className="flex flex-wrap items-center justify-start gap-2 md:flex-row">
        <InfoBadge type="CATEGORY" text={feedback.category.name} />
        <InfoBadge type="DEPARTMENT" text={feedback.department.name} />
        {feedback.location && (
          <InfoBadge type="LOCATION" text={feedback.location} />
        )}
      </div>
      <div className="flex flex-row items-center gap-1"></div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex h-5 items-center space-x-1 text-sm">
          <div className="flex flex-row items-center gap-1">
            <User className="h-3 w-3 text-black/70 md:h-4 md:w-4" />
            <span className="text-[11px] font-medium text-black/70 md:text-[14px]">
              {user.fullName}
            </span>
          </div>
          <Separator orientation="vertical" />
          <span className="text-neutral-dark-primary-400 text-[11px] md:text-[14px]">
            {new Date(createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center gap-1">
            <ThumbsUp
              className={cn(
                hasVoted
                  ? "text-blue-primary-500"
                  : "text-neutral-dark-primary-400",
                "h-4 w-4",
              )}
            />
            <span className="text-neutral-dark-primary-400 text-[11px] md:text-[14px]">
              {votes}
            </span>
          </div>
          <div className="flex flex-row items-center gap-1 rounded-lg">
            <MessageSquare className="text-neutral-dark-primary-400 h-4 w-4" />
            <span className="text-neutral-dark-primary-400 text-[11px] md:text-[14px]">
              {commentsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
