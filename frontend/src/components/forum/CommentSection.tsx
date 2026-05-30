"use client";
import { useUser } from "@/context/UserContext";
import {
  useCreateCommentByAnnouncementId,
  useCreateCommentByPostId,
  useDeleteComment,
} from "@/hooks/queries/useCommentQueries";
import { cn } from "@/lib/utils";
import { Comment } from "@/types";
import { MessageCircle, Send, User } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CommentItem from "./CommentItem";

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
      className="mt-6 flex w-full flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm md:p-8"
    >
      {/* Discussion Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          Thảo luận
          <span className="flex h-6 min-w-[24px] items-center justify-center rounded-md bg-slate-100 px-1.5 text-xs font-semibold text-slate-600">
            {totalComments}
          </span>
        </h2>
      </div>

      {/* Comment Input Area (Top) */}
      <div className="flex gap-4">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 ring-1 ring-slate-200 sm:flex">
          {user?.role !== "STUDENT" ? (
            <User className="h-5 w-5" />
          ) : (
            <Avatar className="h-full w-full">
              <AvatarImage
                src={user?.avatarUrl || "https://github.com/shadcn.png"}
                className="object-cover"
              />
              <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
                {user?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <Textarea
            placeholder="Viết bình luận..."
            className="min-h-[100px] resize-none rounded-xl border-slate-200 bg-slate-50 p-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/50"
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewComment(e.target.value)
            }
          />
          <div className="flex justify-end">
            <Button
              type="button"
              className={cn(
                "h-9 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors",
                newComment.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-100 text-slate-400 hover:bg-slate-100",
              )}
              onClick={handleNewCommentSubmit}
              disabled={isCreating || !newComment.trim()}
            >
              {isCreating ? (
                "Đang gửi..."
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Gửi bình luận
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-100" />

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
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
              <MessageCircle className="h-6 w-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">
                Chưa có bình luận nào
              </p>
              <p className="text-xs text-slate-500">
                Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
