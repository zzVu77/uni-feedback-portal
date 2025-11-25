import { CalendarFold, MessageSquare, ThumbsUp, User } from "lucide-react";
import InfoBadge from "../common/InfoBadge";
import StatusBadge from "../common/StatusBadge";
import Attachment from "../feedback/Attachment";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ForumPostDetail } from "@/types";
import { cn } from "@/lib/utils";
type Props = {
  data: ForumPostDetail;
};
const FeedbackPostDetail = ({ data }: Props) => {
  const { feedback, createdAt, hasVoted, user, votes, commentsCount } = data;
  return (
    <div className="flex w-full flex-col gap-3 rounded-xl bg-white px-3 py-4 shadow-sm md:px-4">
      <div className="flex flex-row items-center justify-between">
        {/* Post Title */}
        <h2 className="text-md font-semibold md:text-[16px] lg:text-2xl">
          {feedback.subject}
        </h2>
        <StatusBadge type="IN_PROGRESS" />
      </div>
      <div className="flex h-5 items-center space-x-1 text-sm">
        <div className="flex flex-row items-center gap-1">
          <User className="text-neutral-dark-primary-400 h-3 w-3 md:h-4 md:w-4" />
          <span className="text-[11px] font-normal text-black/50 md:text-[14px]">
            {user.fullName}
          </span>
        </div>
        <Separator orientation="vertical" />
        <CalendarFold className="text-neutral-dark-primary-400 h-4 w-4" />
        <span className="text-neutral-dark-primary-400 text-[11px] font-light md:text-[14px]">
          {new Date(createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>
      {/* Post Short Content */}
      <span className="text-md font-normal text-black/80">
        {feedback.description}
      </span>
      {/* Attachments */}
      <div className="flex flex-col gap-2">
        <span className="mt-4 text-[18px] font-medium">Tệp đính kèm:</span>
        <Attachment />
        <Attachment />
        <Attachment />
      </div>
      {/* Tags */}
      <div className="flex flex-row items-center justify-start gap-2">
        <InfoBadge type="CATEGORY" text={feedback.category.name} />
        <InfoBadge type="DEPARTMENT" text={feedback.department.name} />
        {feedback.location && (
          <InfoBadge type="LOCATION" text={feedback.location} />
        )}
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-row items-center gap-1"></div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-between gap-3">
          <Button
            className="hover:text-blue-primary-600 flex flex-row items-center gap-1 rounded-lg border-none shadow-none hover:bg-transparent"
            variant="outline"
          >
            <ThumbsUp className="hover:text-blue-primary-600 h-4 w-4" />
            {votes}
          </Button>
          <Button
            className={cn(
              hasVoted
                ? "hover:text-blue-primary-600"
                : "hover:text-neutral-dark-primary-400",
              "hover:text-blue-primary-600 flex flex-row items-center gap-1 rounded-lg border-none shadow-none hover:bg-transparent",
            )}
            variant="outline"
          >
            <MessageSquare className="hover:text-blue-primary-600 h-4 w-4" />
            {commentsCount}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPostDetail;
