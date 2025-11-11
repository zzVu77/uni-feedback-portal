"use client";
import { MessageCircle, Send, SquarePen } from "lucide-react";
import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import CommentItem from "./CommentItem";
import { Comment } from "@/types";

const mockCommentsData: Comment[] = [
  {
    id: "1",
    user: {
      id: "1",
      fullName: "Nguyễn Văn Vũ",
      role: "STUDENT",
    },
    createdAt: "20/10/2025",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae cumque omnis totam nam, illum illo voluptas!",
    replies: [
      {
        id: "1.1",
        user: {
          id: "2",
          fullName: "Trần Thị B",
          role: "STAFF",
        },
        createdAt: "21/10/2025",
        content: "Đây là một câu trả lời cho bình luận của anh Vũ.",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    user: {
      id: "3",
      fullName: "Lê Văn A",
      role: "STUDENT",
    },
    createdAt: "22/10/2025",
    content:
      "Tempora nemo, delectus nam itaque rerum quod sunt, ut ea accusamus ex fugiat iste.",
    replies: [],
  },
];

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(mockCommentsData);
  const [newComment, setNewComment] = useState<string>("");

  const handleNewCommentSubmit = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: crypto.randomUUID(),
      user: {
        id: "1234",
        fullName: "Người dùng (Bạn)",
        role: "STUDENT",
      },
      createdAt: new Date().toLocaleDateString("vi-VN"),
      content: newComment,
      replies: [],
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  // handle reply submission
  const handleReplySubmit = (parentId: string, content: string) => {
    const newReplyObj: Comment = {
      id: crypto.randomUUID(),
      user: {
        id: "1234",
        fullName: "Người dùng (Bạn)",
        role: "STUDENT",
      },
      createdAt: new Date().toLocaleDateString("vi-VN"),
      content: content,
      replies: [],
    };

    setComments((prevComments) =>
      prevComments.map((comment) => {
        // find parent comment id
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReplyObj],
          };
        }
        return comment;
      }),
    );
  };

  const totalComments = comments.reduce((count, comment) => {
    return count + 1 + comment.replies.length;
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
        >
          <Send className="h-5 w-5" />
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
