import { cn } from "@/lib/utils";
import { Comment } from "@/types";
import { School, User } from "lucide-react";
import React, { useState } from "react";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ReportDialog } from "./ReportDialog";
// Import hook
import { useReportComment } from "@/hooks/queries/useCommentQueries";

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
    <div className="group/comment flex w-full gap-4">
      {/* Avatar Section */}
      <div className="flex shrink-0 flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-slate-500",
            isStaff
              ? "bg-emerald-100 text-emerald-600 ring-2 ring-emerald-50"
              : "bg-slate-100",
          )}
        >
          {isStaff ? (
            <School className="h-5 w-5" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </div>
        {/* Thread Line */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 w-px flex-1 bg-slate-100" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-bold",
              isStaff ? "text-emerald-700" : "text-slate-900",
            )}
          >
            {comment.user.fullName}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <time className="text-xs text-slate-400">
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
        <div className="mt-1 flex items-center gap-4">
          {level < 2 && (
            <Button
              variant="outline"
              onClick={() => setIsReplying(!isReplying)}
              className="border-none bg-transparent text-xs font-semibold text-slate-500 transition-colors hover:bg-transparent hover:text-blue-600"
            >
              Trả lời
            </Button>
          )}

          {!isAuthor && (
            <ReportDialog onSubmit={handleReportSubmit}>
              <Button
                variant="outline"
                className="border-none bg-transparent text-xs font-semibold text-slate-500 transition-colors hover:bg-transparent hover:text-amber-600"
              >
                Báo cáo
              </Button>
            </ReportDialog>
          )}

          {isAuthor && (
            <ConfirmationDialog
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa bình luận này không?"
              onConfirm={handleDelete}
            >
              <Button
                variant={"outline"}
                className="border-none bg-transparent text-xs font-semibold text-slate-500 transition-colors hover:bg-transparent hover:text-red-600"
              >
                Xóa
              </Button>
            </ConfirmationDialog>
          )}
        </div>

        {/* Form reply */}
        {isReplying && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <Textarea
              placeholder="Viết câu trả lời..."
              value={replyContent}
              className="min-h-[80px] resize-none border-slate-200 bg-white"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setReplyContent(e.target.value)
              }
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-slate-500"
                onClick={() => setIsReplying(false)}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700"
                onClick={handleSubmitReply}
              >
                Gửi trả lời
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies with Guide Line */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 border-l-2 border-slate-100 pl-6">
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
