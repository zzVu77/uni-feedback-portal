import {
  useUnvoteForumPost,
  useVoteForumPost,
} from "@/hooks/queries/useForumPostQueries";
import { cn } from "@/lib/utils";
import { ForumPostDetail } from "@/types";
import DOMPurify from "dompurify";
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import InfoBadge from "../common/InfoBadge";
import StatusBadge from "../common/StatusBadge";
import Attachment from "../feedback/Attachment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

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
    <div className="relative flex w-full flex-col overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/50 md:p-12">
      {/* Header Area */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <h1 className="flex-1 text-3xl leading-tight font-black tracking-tight text-slate-900 md:text-4xl lg:text-[2.75rem]">
            {feedback.subject}
          </h1>
          <div className="shrink-0 pt-2 md:pt-0">
            <StatusBadge type={feedback.currentStatus} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
          <div className="flex items-center gap-4">
            {/* Premium Avatar Ring */}
            <div className="rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shadow-md">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage
                  src={user?.avatarUrl || "https://github.com/shadcn.png"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-100 font-bold text-slate-800">
                  {user?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "CN"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900">
                {user.fullName}
              </span>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
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

          <div className="hidden h-10 w-px bg-slate-200 md:block" />

          <div className="flex flex-wrap items-center gap-2.5">
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
        className="prose prose-slate prose-lg prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-2xl max-w-none"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* Attachments */}
      {feedback.fileAttachments && feedback.fileAttachments.length > 0 && (
        <div className="mt-10 rounded-[1.5rem] bg-slate-50 p-6 ring-1 ring-slate-100">
          <h2 className="mb-5 flex items-center gap-3 text-lg font-extrabold text-slate-900">
            Tệp đính kèm
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-bold text-blue-700">
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
      <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-8">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleToggleVote}
            disabled={isBusy}
            className={cn(
              "group flex h-14 items-center gap-3 rounded-full px-8 text-[17px] font-bold shadow-md transition-all duration-300 hover:-translate-y-1",
              hasVoted
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40"
                : "bg-white text-slate-700 shadow-slate-200/50 hover:bg-slate-50 hover:shadow-lg",
            )}
          >
            <ThumbsUp
              className={cn(
                "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                hasVoted ? "fill-current" : "",
                isVoting ? "animate-pulse" : "",
              )}
            />
            <span>{votes}</span>
            <span className="hidden sm:inline">
              {hasVoted ? "Đã thích" : "Thích"}
            </span>
          </Button>

          <Link href="#comment-section">
            <Button className="group flex h-14 items-center gap-3 rounded-full bg-white px-8 text-[17px] font-bold text-slate-700 shadow-md shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-200/60">
              <MessageSquare className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span>{commentsCount}</span>
              <span className="ml-1 hidden sm:inline">Bình luận</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPostDetail;
