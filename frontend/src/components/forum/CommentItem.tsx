"use client";
import { Flag, User, MessageSquareReply, Send, BadgeCheck } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ReportDialog } from "./ReportDialog";
import { Comment } from "@/types";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  comment: Comment;
  onReplySubmit: (parentId: string, content: string) => void;
  level?: number;
  isLast?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReplySubmit,
  level = 1,
  isLast = false,
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    onReplySubmit(comment.id, replyContent);
    setReplyContent("");
    setIsReplying(false);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1 bg-transparent py-2",
        !isLast && "border-b border-gray-200",
        comment.user.role === "STAFF" && "rounded-md bg-green-100/50 p-2",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {comment.user.role === "STAFF" && (
          <BadgeCheck className="h-5 w-5 text-green-500" />
        )}
        <div className="bg-neutral-light-primary-200 flex h-8 w-8 flex-row items-center justify-center rounded-full p-2">
          <User className="text-neutral-dark-primary-700" />
        </div>
        <div className="flex flex-row items-center gap-1">
          <span className="text-[14px] font-medium text-black">
            {comment.user.fullName}
          </span>
          <time className="text-[13px] font-normal text-gray-400 before:mx-1 before:content-['•']">
            {comment.createdAt}
          </time>
        </div>
      </div>
      <div className="pl-4">
        <p className="pl-4 text-black/80">{comment.content}</p>
        <div className="flex flex-row items-center gap-2 pl-4">
          {level < 2 && (
            <Button
              className="hover:text-blue-primary-400 text-neutral-dark-primary-700/70 flex w-fit flex-row items-center gap-1 rounded-lg border-none bg-transparent px-0 text-sm shadow-none hover:bg-transparent"
              variant="outline"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageSquareReply className="h-4 w-4" /> Trả lời
            </Button>
          )}
          <ReportDialog onSubmit={() => Promise.resolve()}>
            <Button
              className="hover:text-red-primary-400 text-neutral-dark-primary-700/70 flex w-fit flex-row items-center gap-1 rounded-lg border-none bg-transparent px-0 text-sm shadow-none hover:bg-transparent"
              variant="outline"
            >
              <Flag className="h-4 w-4" /> Báo cáo
            </Button>
          </ReportDialog>
        </div>
        {/* Form reply */}
        {isReplying && (
          <div className="mt-3 flex flex-col gap-3 pl-4">
            <Textarea
              placeholder="Viết câu trả lời của bạn..."
              value={replyContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReplyContent(e.target.value)
              }
            />
            <div className="flex flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-fit py-2 shadow-sm"
                onClick={() => setIsReplying(false)}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex w-fit flex-row items-center gap-2 py-2 shadow-md"
                onClick={handleSubmitReply}
              >
                <Send className="h-4 w-4" />
                Gửi trả lời
              </Button>
            </div>
          </div>
        )}
        {/* Render nested comments */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 pl-8">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReplySubmit={onReplySubmit}
                level={level + 1}
                isLast={
                  reply.id === comment.replies[comment.replies.length - 1].id
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
