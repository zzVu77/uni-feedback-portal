import { cn } from "@/lib/utils";
import { Comment } from "@/types";
import {
  BadgeCheck,
  Flag,
  MessageSquareReply,
  Send,
  Trash2,
  User,
} from "lucide-react";
import React, { useState } from "react";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ReportDialog } from "./ReportDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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
  isLast = false,
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");

  // Integrate Report Mutation
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

  // Handle report submission from dialog
  const handleReportSubmit = async (reason: string) => {
    await reportComment({ id: comment.id, reason });
  };

  const isAuthor = currentUser.id === comment.user.id;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1 rounded-lg bg-white px-2 py-2",
        !isLast && "border-b border-gray-200",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {comment.user.role === "DEPARTMENT_STAFF" && (
          <Tooltip>
            <TooltipTrigger>
              <BadgeCheck className="h-5 w-5 text-green-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-[10px]">Cán bộ nhà trường</p>
            </TooltipContent>
          </Tooltip>
        )}
        <div className="bg-neutral-light-primary-200 flex h-8 w-8 flex-row items-center justify-center rounded-full p-2">
          <User className="text-neutral-dark-primary-700" />
        </div>
        <div className="flex flex-row items-center gap-1">
          <span className="text-[14px] font-medium text-black">
            {comment.user.fullName}
          </span>
          <time className="text-[13px] font-normal text-gray-400 before:mx-1 before:content-['•']">
            {new Date(comment.createdAt).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
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

          {/* Connected Report Dialog */}
          {!isAuthor && (
            <ReportDialog onSubmit={handleReportSubmit}>
              <Button
                className="hover:text-red-primary-400 text-neutral-dark-primary-700/70 flex w-fit flex-row items-center gap-1 rounded-lg border-none bg-transparent px-0 text-sm shadow-none hover:bg-transparent"
                variant="outline"
              >
                <Flag className="h-4 w-4" /> Báo cáo
              </Button>
            </ReportDialog>
          )}

          {isAuthor && (
            <ConfirmationDialog
              title="Xác nhận xóa bình luận"
              description="Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác."
              onConfirm={handleDelete}
            >
              <Button
                className="hover:text-red-primary-400 text-neutral-dark-primary-700/70 flex w-fit flex-row items-center gap-1 rounded-lg border-none bg-transparent px-0 text-sm shadow-none hover:bg-transparent"
                variant="outline"
              >
                <Trash2 className="h-4 w-4" /> Xóa
              </Button>
            </ConfirmationDialog>
          )}
        </div>
        {/* Form reply */}
        {isReplying && (
          <div className="mt-3 flex flex-col gap-3 pl-4">
            <Textarea
              placeholder="Viết câu trả lời của bạn..."
              value={replyContent}
              className="bg-white"
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
          <div className="mt-4 flex flex-col gap-2 px-2 pl-8">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReplySubmit={onReplySubmit}
                onDelete={onDelete}
                currentUser={currentUser}
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
