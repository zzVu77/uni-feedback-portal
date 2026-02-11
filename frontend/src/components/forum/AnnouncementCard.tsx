import { AnnouncementListItem } from "@/types";
import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { stripHtml } from "@/utils/stripHtml";

const AnnouncementCard = ({
  announcement,
}: {
  announcement: AnnouncementListItem;
}) => {
  const previewContent = useMemo(() => {
    return stripHtml(announcement.content);
  }, [announcement.content]);

  return (
    <div className="group relative flex w-full flex-col rounded-xl border border-slate-100 bg-yellow-50/30 p-4 shadow-sm transition-all duration-300 hover:scale-101 hover:border-slate-300 hover:shadow-md md:p-6">
      {/* Header: Department & Date */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-900">
            {announcement.department.name}
          </span>
        </div>
        <span className="text-xs text-slate-400">
          {new Date(announcement.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2">
        <Link href={`/forum/announcements/${announcement.id}`}>
          <h2 className="text-lg font-bold text-slate-900 transition-colors hover:text-blue-600 md:text-xl">
            {announcement.title}
          </h2>
        </Link>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 md:text-base">
          {previewContent}
        </p>
      </div>

      {/* Footer: Read More */}
      <div className="mt-4 flex items-center justify-end border-t border-slate-100/50 pt-3">
        <Link
          href={`/forum/announcements/${announcement.id}`}
          className="group/more flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/more:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementCard;
