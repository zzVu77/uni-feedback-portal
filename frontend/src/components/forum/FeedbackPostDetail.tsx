import { Calendar, MessageSquare, ThumbsUp, User } from "lucide-react";
import InfoBadge from "../common/InfoBadge";
import StatusBadge from "../common/StatusBadge";
import Attachment from "../feedback/Attachment";
import { Button } from "../ui/button";
import { ForumPostDetail } from "@/types";
import { cn } from "@/lib/utils";
import {
  useUnvoteForumPost,
  useVoteForumPost,
} from "@/hooks/queries/useForumPostQueries";
import Link from "next/link";
import DOMPurify from "dompurify";

type Props = {
  data: ForumPostDetail;
  commentsCount?: number;
};

const FeedbackPostDetail = ({ data, commentsCount }: Props) => {
  const { id, feedback, createdAt, hasVoted, user, votes } = data;
  const { mutate: vote, isPending: isVoting } = useVoteForumPost(id);
  const { mutate: unvote, isPending: isUnvoting } = useUnvoteForumPost(id);
  const safeContent = DOMPurify.sanitize(feedback.description || "");
  const isBusy = isVoting || isUnvoting;

  const handleToggleVote = () => {
    if (hasVoted) {
      unvote();
    } else {
      vote();
    }
  };

  return (
    <div className="flex w-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      {/* Header Area */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="flex-1 text-2xl leading-tight font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
            {feedback.subject}
          </h1>
          <div className="shrink-0 pt-1">
            <StatusBadge type={feedback.currentStatus} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900">
                {user.fullName}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
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

          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          <div className="flex flex-wrap items-center gap-2">
            <InfoBadge type="CATEGORY" text={feedback.category.name} />
            <InfoBadge type="DEPARTMENT" text={feedback.department.name} />
            {feedback.location && (
              <InfoBadge type="LOCATION" text={feedback.location} />
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div
        className="prose prose-slate prose-lg prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* Attachments */}
      {feedback.fileAttachments && feedback.fileAttachments.length > 0 && (
        <div className="mt-12 border-t border-slate-100 pt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            Tệp đính kèm
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {feedback.fileAttachments.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {feedback.fileAttachments.map((attachment, index) => (
              <Attachment
                key={index}
                fileName={attachment.fileName}
                fileUrl={attachment.fileUrl}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleToggleVote}
            disabled={isBusy}
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-6 text-base font-semibold transition-all duration-300",
              hasVoted
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                : "bg-transparent text-slate-600 hover:bg-slate-50",
            )}
          >
            <ThumbsUp
              className={cn(
                "h-5 w-5",
                hasVoted ? "fill-current" : "",
                isVoting ? "animate-pulse" : "",
              )}
            />
            <span>{votes}</span>
          </Button>

          <Link href="#comment-section">
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full px-6 py-6 text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{commentsCount}</span>
              <span className="ml-1 hidden sm:inline">Bình luận</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t border-slate-100 bg-white/80 p-4 backdrop-blur-lg md:hidden">
        <Button
          onClick={handleToggleVote}
          disabled={isBusy}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full py-6 font-bold shadow-lg transition-all active:scale-95",
            hasVoted
              ? "bg-blue-600 text-white shadow-blue-200"
              : "bg-slate-900 text-white shadow-slate-200",
          )}
        >
          <ThumbsUp className={cn("h-5 w-5", hasVoted && "fill-current")} />
          <span>{votes} Thích</span>
        </Button>
      </div>
    </div>
  );
};

export default FeedbackPostDetail;
