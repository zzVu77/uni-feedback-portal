"use client";
import { MessageCircle, Send, SquarePen } from "lucide-react";
import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import CommentItem from "./CommentItem";
import { Comment } from "@/types";
import { useUser } from "@/context/UserContext";
import {
  useCreateComment,
  useDeleteComment,
} from "@/hooks/queries/useCommentQueries";

type Props = {
  postId: string;
  data: Comment[];
};

const CommentSection: React.FC<Props> = ({ data, postId }) => {
  const comments = data || [];
  const [newComment, setNewComment] = useState<string>("");
  const { user } = useUser();

  // Integration: Create Mutation
  const { mutate: createComment, isPending: isCreating } =
    useCreateComment(postId);

  // Integration: Delete Mutation
  const { mutate: deleteComment } = useDeleteComment(postId);

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
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white px-4 py-3 shadow-md">
      <div className="flex flex-row items-center justify-start gap-2">
        <MessageCircle className="text-neutral-dark-primary-700 h-6 w-6" />
        <span className="text-neutral-dark-primary-700 text-[18px] font-medium">
          Thảo luận ({totalComments})
        </span>
      </div>
      <ScrollArea className="overflow-y-auto pr-4">
        <div className="flex max-h-[550px] flex-col gap-4">
          {/* Render list comment */}
          {comments.map((comment) => (
            <CommentItem
              // Pass the delete handler
              onDelete={handleDeleteComment}
              currentUser={{
                id: user?.id || "",
                role: user?.role || "STUDENT",
              }}
              key={comment.id}
              comment={comment}
              onReplySubmit={handleReplySubmit}
              level={1}
              isLast={comment.id === comments[comments.length - 1].id}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-start gap-2">
          <SquarePen className="text-neutral-dark-primary-700 h-6 w-6" />
          <span className="text-neutral-dark-primary-700 text-[18px] font-medium">
            Bình luận
          </span>
        </div>
        <Textarea
          placeholder="Viết ý kiến của bạn..."
          value={newComment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNewComment(e.target.value)
          }
        />
        <Button
          type="button"
          variant={"primary"}
          className="flex w-fit flex-row items-center gap-2 self-end py-3 shadow-md"
          onClick={handleNewCommentSubmit}
          disabled={isCreating}
        >
          <Send className="h-5 w-5" />
          {isCreating ? "Đang gửi..." : "Gửi"}
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
