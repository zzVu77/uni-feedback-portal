import {
  CalendarFold,
  Flag,
  MessageSquare,
  ThumbsUp,
  User,
} from "lucide-react";
import InfoBadge from "../common/InfoBadge";
import StatusBadge from "../common/StatusBadge";
import { Separator } from "../ui/separator";
import Attachment from "../feedback/Attachment";
import { Button } from "../ui/button";

const FeedbackPostDetail = () => {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[8px] bg-white px-3 py-4 shadow-sm md:px-4">
      <div className="flex flex-row items-center justify-between">
        {/* Post Title */}
        <h2 className="text-md font-semibold md:text-[16px] lg:text-2xl">
          Extended Library Hours During Finals Week
        </h2>
        <StatusBadge type="IN_PROGRESS" />
      </div>
      <div className="flex h-5 items-center space-x-1 text-sm">
        <div className="flex flex-row items-center gap-1">
          <User className="text-neutral-dark-primary-400 h-3 w-3 md:h-4 md:w-4" />
          <span className="text-[11px] font-normal text-black/50 md:text-[14px]">
            Nguyễn Văn Vũ
          </span>
        </div>
        <Separator orientation="vertical" />
        <CalendarFold className="text-neutral-dark-primary-400 h-4 w-4" />
        <span className="text-neutral-dark-primary-400 text-[11px] font-light md:text-[14px]">
          2023-11-01
        </span>
      </div>
      {/* Post Short Content */}
      <h3 className="text-md font-normal text-black/80">
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem earum
        commodi accusamus et vitae consequuntur dolor aperiam ducimus ab
        laudantium eius, amet quibusdam illo ea dignissimos iusto possimus ullam
        in? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore
        ipsa cum repudiandae architecto totam voluptatum nesciunt ipsam iusto
        itaque? Consequuntur repellendus possimus quam exercitationem eligendi,
        sequi nemo ab vel pariatur!
      </h3>
      {/* Attachments */}
      <div className="flex flex-col gap-2">
        <span className="mt-4 text-[18px] font-medium">Tệp đính kèm:</span>
        <Attachment />
        <Attachment />
        <Attachment />
      </div>
      {/* Tags */}
      <div className="flex flex-row items-center justify-start gap-2">
        <InfoBadge type="CATEGORY" text="Facilities" />
        <InfoBadge type="DEPARTMENT" text="Library" />
        <InfoBadge type="LOCATION" text="F1-409" />
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-row items-center gap-1"></div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-between gap-3">
          <Button
            className="hover:text-blue-primary-600 flex flex-row items-center gap-1 rounded-lg border-none shadow-none hover:bg-transparent"
            variant="outline"
          >
            <ThumbsUp className="hover:text-blue-primary-600 h-4 w-4" />
            123
          </Button>
          <Button
            className="hover:text-blue-primary-600 flex flex-row items-center gap-1 rounded-lg border-none shadow-none hover:bg-transparent"
            variant="outline"
          >
            <MessageSquare className="hover:text-blue-primary-600 h-4 w-4" />
            123
          </Button>
          <Button
            className="hover:text-red-primary-400 flex flex-row items-center gap-1 rounded-lg border-none shadow-none hover:bg-transparent"
            variant="outline"
          >
            <Flag className="hover:text-blue-primary-600 h-4 w-4" /> Báo cáo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPostDetail;
