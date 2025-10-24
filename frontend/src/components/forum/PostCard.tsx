import { MessageSquare, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import InfoBadge from "../common/InfoBadge";
import StatusBadge from "../common/StatusBadge";
import { Separator } from "../ui/separator";

const PostCard = () => {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[8px] bg-white px-3 py-4 shadow-sm transition-shadow duration-200 hover:scale-101 md:px-4">
      <div className="flex flex-row items-center justify-between">
        {/* Post Title */}
        <Link href={"/forum/1"}>
          <h2 className="text-md hover:text-blue-primary-300 max-w-[200px] truncate font-semibold md:max-w-lg md:text-[16px] lg:text-xl">
            Extended Library Hours During Finals Week
          </h2>
        </Link>
        <StatusBadge type="IN_PROGRESS" />
      </div>
      {/* Post Short Content */}
      <h3 className="lg:text-md text-neutral-dark-primary-600 line-clamp-2 text-sm font-normal">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore adipisci
        neque amet voluptatum eaque nihil sunt nisi accusamus illo voluptatem,
        cupiditate dolore tempora, provident at deserunt velit perferendis
        ducimus. Architecto! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Labore adipisci neque amet voluptatum eaque nihil sunt nisi
        accusamus illo voluptatem, cupiditate dolore tempora, provident at
        deserunt velit perferendis ducimus. Architecto! Lorem ipsum dolor sit
        amet consectetur adipisicing elit. Labore adipisci neque amet voluptatum
        eaque nihil sunt nisi accusamus illo voluptatem, cupiditate dolore
        tempora, provident at deserunt velit perferendis ducimus. Architecto!
      </h3>
      {/* Tags */}
      <div className="flex flex-row items-center justify-start gap-2">
        <InfoBadge type="CATEGORY" text="Facilities" />
        <InfoBadge type="DEPARTMENT" text="Library" />
        <InfoBadge type="LOCATION" text="F1-409" />
      </div>
      <div className="flex flex-row items-center gap-1"></div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex h-5 items-center space-x-1 text-sm">
          <div className="flex flex-row items-center gap-1">
            <User className="h-3 w-3 text-black/70 md:h-4 md:w-4" />
            <span className="text-[11px] font-medium text-black/70 md:text-[14px]">
              Nguyễn Văn Vũ
            </span>
          </div>
          <Separator orientation="vertical" />
          <span className="text-neutral-dark-primary-400 text-[11px] md:text-[14px]">
            2023-11-01
          </span>
        </div>
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center gap-1">
            <ThumbsUp className="text-blue-primary-400 h-4 w-4" />
            <span className="text-neutral-dark-primary-400 text-[11px] md:text-[14px]">
              123
            </span>
          </div>
          <div className="flex flex-row items-center gap-1 rounded-lg">
            <MessageSquare className="text-blue-primary-400 h-4 w-4" />
            <span className="text-neutral-dark-primary-400 text-[11px] md:text-[14px]">
              123
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
