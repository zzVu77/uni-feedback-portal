import { cn } from "@/lib/utils";
import { Comment } from "@/types";
import { School, Reply } from "lucide-react";
import React, { useState } from "react";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ReportDialog } from "./ReportDialog";
// Import hook
import { useReportComment } from "@/hooks/queries/useCommentQueries";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CommentItemProps {
  comment: Comment;
  onReplySubmit: (parentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  currentUser: { id: string; role: string };
  level?: number;
  isLast?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReplySubmit,
  onDelete,
  currentUser,
  level = 1,
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");

  const { mutateAsync: reportComment } = useReportComment();

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    onReplySubmit(comment.id, replyContent);
    setReplyContent("");
    setIsReplying(false);
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const handleReportSubmit = async (reason: string) => {
    await reportComment({ id: comment.id, reason });
  };

  const isAuthor = currentUser.id === comment.user.id;
  const isStaff = comment.user.role !== "STUDENT";

  return (
    <div className="group/comment flex w-full gap-3">
      {/* Avatar Section */}
      <div className="flex shrink-0 flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-slate-200",
            isStaff ? "bg-emerald-50 text-emerald-600" : "bg-slate-50",
          )}
        >
          {isStaff ? (
            <School className="h-4 w-4" />
          ) : (
            <Avatar className="h-full w-full">
              <AvatarImage
                src={comment.user.avatarUrl || "https://github.com/shadcn.png"}
                className="object-cover"
              />
              <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
                {comment.user.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        {/* Thread Line */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 w-px flex-1 bg-slate-200" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold",
              isStaff ? "text-emerald-700" : "text-slate-900",
            )}
          >
            {comment.user.fullName}
          </span>
          <span className="text-xs text-slate-300">•</span>
          <time className="text-xs text-slate-500">
            {new Date(comment.createdAt).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>

        <div className="text-sm leading-relaxed text-slate-700">
          {comment.content}
        </div>

        {/* Actions */}
        <div className="mt-1 flex items-center gap-2 text-slate-500">
          {level < 2 && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-blue-600"
            >
              <Reply className="h-3.5 w-3.5" />
              Trả lời
            </button>
          )}

          {!isAuthor && (
            <ReportDialog onSubmit={handleReportSubmit}>
              <button className="text-xs font-semibold transition-colors hover:text-amber-600">
                Báo cáo
              </button>
            </ReportDialog>
          )}

          {isAuthor && (
            <ConfirmationDialog
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa bình luận này không?"
              onConfirm={handleDelete}
            >
              <button className="text-xs font-semibold transition-colors hover:text-red-600">
                Xóa
              </button>
            </ConfirmationDialog>
          )}
        </div>

        {/* Form reply */}
        {isReplying && (
          <div className="mt-2 flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <Textarea
              placeholder={`Trả lời ${comment.user.fullName}...`}
              value={replyContent}
              className="min-h-[60px] resize-none rounded-md border-slate-200 bg-white p-2.5 text-sm focus:ring-2 focus:ring-blue-500/50"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReplyContent(e.target.value)
              }
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 rounded-md px-3 text-xs font-semibold text-slate-500 hover:bg-slate-200/50"
                onClick={() => setIsReplying(false)}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                className="h-8 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
                onClick={handleSubmitReply}
              >
                Gửi
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 flex flex-col gap-4 pt-1">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReplySubmit={onReplySubmit}
                onDelete={onDelete}
                currentUser={currentUser}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
