import { AnnouncementListItem } from "@/types";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";

const AnnouncementCard = ({
  announcement,
}: {
  announcement: AnnouncementListItem;
}) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white px-3 py-4 shadow-sm transition-shadow duration-200 hover:scale-101 md:px-4">
      <div className="flex flex-row items-center justify-between">
        {/* Post Title */}
        <Link href={`/forum/announcements/${announcement.id}`}>
          <h2 className="text-md hover:text-blue-primary-300 max-w-[200px] truncate font-semibold md:max-w-lg md:text-[16px] lg:text-xl">
            {announcement.title}
          </h2>
        </Link>
      </div>
      {/* Post Short Content */}
      <h3 className="lg:text-md text-neutral-dark-primary-600 line-clamp-2 text-sm font-normal">
        {announcement.content}
      </h3>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex h-5 items-center space-x-1 text-sm">
          <div className="flex flex-row items-center gap-1">
            <div className="bg-yellow-primary-100 flex h-8 w-8 flex-row items-center justify-center rounded-full p-2">
              <Building2 className="text-yellow-primary-200" />
            </div>
            <span className="text-[11px] font-medium text-black/70 md:text-[14px]">
              {announcement.department.name}
            </span>
          </div>
          <Separator orientation="vertical" />
          <span className="text-neutral-dark-primary-400 text-[11px] md:text-[14px]">
            {new Date(announcement.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
