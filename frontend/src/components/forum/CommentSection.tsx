"use client";
import { User } from "lucide-react";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import CommentItem from "./CommentItem";
import { Comment } from "@/types";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import {
  useCreateCommentByAnnouncementId,
  useCreateCommentByPostId,
  useDeleteComment,
} from "@/hooks/queries/useCommentQueries";

type Props = {
  postId: string;
  data: Comment[];
  type: "feedback" | "announcement"; // Added type prop
};

const CommentSection: React.FC<Props> = ({ data, postId, type }) => {
  const comments = data || [];
  const [newComment, setNewComment] = useState<string>("");
  const { user } = useUser();

  // 1. Feedback Hooks
  const { mutate: createFeedbackComment, isPending: isCreatingFeedback } =
    useCreateCommentByPostId(postId);

  // 2. Announcement Hooks
  const {
    mutate: createAnnouncementComment,
    isPending: isCreatingAnnouncement,
  } = useCreateCommentByAnnouncementId(postId);

  // 3. Delete Hook (handles invalidation based on type)
  const { mutate: deleteComment } = useDeleteComment(postId, type);

  // Select the active function and state based on props
  const createComment =
    type === "feedback" ? createFeedbackComment : createAnnouncementComment;

  const isCreating =
    type === "feedback" ? isCreatingFeedback : isCreatingAnnouncement;

  // --- HANDLERS ---

  const handleNewCommentSubmit = () => {
    if (!newComment.trim()) return;

    createComment(
      { content: newComment },
      {
        onSuccess: () => {
          setNewComment("");
        },
      },
    );
  };

  const handleReplySubmit = (parentId: string, content: string) => {
    createComment(
      { content: content, parentId: parentId },
      {
        onSuccess: () => {},
      },
    );
  };

  // Handler for deleting a comment
  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
  };

  const totalComments = comments.reduce((count, comment) => {
    return count + 1 + (comment.replies ? comment.replies.length : 0);
  }, 0);

  return (
    <div
      id="comment-section"
      className="mt-2 flex w-full flex-col gap-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8"
    >
      {/* Discussion Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          Thảo luận
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
            {totalComments}
          </span>
        </h2>
      </div>

      {/* Comment Input Area (Top) */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 sm:flex">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <Textarea
              placeholder="Chia sẻ ý kiến của bạn..."
              className="min-h-[100px] resize-none border-slate-200 bg-slate-50/30 p-4 transition-all duration-200 focus:bg-white"
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewComment(e.target.value)
              }
            />
            <div className="flex justify-end">
              <Button
                type="button"
                className={cn(
                  "rounded-full px-8 py-2 font-semibold shadow-sm transition-all duration-200",
                  newComment.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-slate-100 text-slate-400",
                )}
                onClick={handleNewCommentSubmit}
                disabled={isCreating || !newComment.trim()}
              >
                {isCreating ? "Đang gửi..." : "Gửi bình luận"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment List Area */}
      <div className="flex flex-col gap-8">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              onDelete={handleDeleteComment}
              currentUser={{
                id: user?.id || "",
                role: user?.role || "STUDENT",
              }}
              key={comment.id}
              comment={comment}
              onReplySubmit={handleReplySubmit}
              level={1}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-slate-400">
              Chưa có bình luận nào. Hãy là người đầu tiên!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
