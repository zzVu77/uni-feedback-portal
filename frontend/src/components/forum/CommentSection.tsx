import { MessageCircle, Send, SquarePen } from "lucide-react";
import React from "react";
import CommentItem from "./CommentItem";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const CommentSection = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[8px] bg-white px-4 py-3 shadow-md">
      <div className="flex flex-row items-center justify-start gap-2">
        <MessageCircle className="text-neutral-dark-primary-700 h-6 w-6" />
        <span className="text-neutral-dark-primary-700 text-[18px] font-medium">
          Thảo luận ({15})
        </span>
      </div>
      <ScrollArea className="overflow-y-auto pr-4">
        <div className="flex max-h-[550px] flex-col gap-4">
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
          <CommentItem />
        </div>
      </ScrollArea>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-start gap-2">
          <SquarePen className="text-neutral-dark-primary-700 h-6 w-6" />
          <span className="text-neutral-dark-primary-700 text-[18px] font-medium">
            Bình luận
          </span>
        </div>
        <Textarea placeholder="Viết ý kiến của bạn..." />
        <Button
          type="button"
          variant={"primary"}
          className="flex w-fit flex-row items-center gap-2 self-end py-3 shadow-md"
        >
          <Send className="h-5 w-5" />
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
