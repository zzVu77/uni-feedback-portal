import { Flag, User } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const CommentItem = () => {
  return (
    <div className="flex w-full flex-col gap-1 border-b-1 border-black/10 bg-transparent px-4 py-2">
      <div className="flex flex-row items-center gap-2">
        <div className="bg-neutral-light-primary-200 flex h-8 w-8 flex-row items-center justify-center rounded-full p-2">
          <User className="text-neutral-dark-primary-700" />
        </div>
        <div className="flex flex-row items-center gap-1">
          <span className="text-[14px] font-medium text-black">
            Nguyễn Văn Vũ
          </span>
          <time className="text-[13px] font-normal text-gray-400 before:mx-1 before:content-['•']">
            {"20/10/2025"}
          </time>
        </div>
      </div>
      <div className="pl-4">
        <p className="pl-4 text-black/80">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae
          cumque omnis totam nam, illum illo voluptas! Tempora nemo, delectus
          nam itaque rerum quod sunt, ut ea accusamus ex fugiat iste.
        </p>
        <Button
          className="hover:text-red-primary-400 text-neutral-dark-primary-700/70 flex w-fit flex-row items-center gap-1 rounded-lg border-none px-0 text-sm shadow-none hover:bg-transparent"
          variant="outline"
        >
          <Flag className="h-4 w-4" /> Báo cáo
        </Button>
      </div>
    </div>
  );
};

export default CommentItem;
