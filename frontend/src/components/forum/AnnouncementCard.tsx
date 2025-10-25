import { Building2, Paperclip } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const AnnouncementCard = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[8px] bg-white px-3 py-4 shadow-sm transition-shadow duration-200 hover:scale-101 md:px-4">
      <div className="flex flex-row items-center justify-between">
        {/* Post Title */}
        <Link href={"/forum/1"}>
          <h2 className="text-md hover:text-blue-primary-300 max-w-[200px] truncate font-semibold md:max-w-lg md:text-[16px] lg:text-xl">
            Library Extended Hours for Finals Week
          </h2>
        </Link>
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
        <Badge className="bg-blue-primary-200/40 py-[2px] shadow-sm md:py-1">
          <Paperclip className={`text-blue-primary-700 font-bold`} />
          <span className="text-blue-primary-700 ml-[1px] text-[10px] md:text-xs">
            Tệp đính kèm ({12})
          </span>
        </Badge>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex h-5 items-center space-x-1 text-sm">
          <div className="flex flex-row items-center gap-1">
            <div className="bg-yellow-primary-100 flex h-8 w-8 flex-row items-center justify-center rounded-full p-2">
              <Building2 className="text-yellow-primary-200" />
            </div>
            <span className="text-[11px] font-medium text-black/70 md:text-[14px]">
              Khoa Đào tạo Quốc tế
            </span>
          </div>
          <Separator orientation="vertical" />
          <span className="text-neutral-dark-primary-400 text-[11px] md:text-[14px]">
            2023-11-01
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
