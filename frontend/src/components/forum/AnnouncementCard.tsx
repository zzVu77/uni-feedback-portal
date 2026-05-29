import { AnnouncementListItem } from "@/types";
import { ArrowRight, Building2, Calendar } from "lucide-react";
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
    <div className="group relative flex w-full flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:ring-amber-500/30 md:p-8">
      {/* Decorative Top Gradient Line - matching PostCard style */}
      <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-500 via-red-500 to-pink-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Background ambient glow effect (amber themed for announcements) */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-50 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header: Department & Date */}
      <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-md ring-2 ring-white transition-transform duration-500 group-hover:scale-110 group-hover:ring-amber-100">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-extrabold tracking-tight text-slate-800">
              {announcement.department.name}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(announcement.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <Link
        href={`/forum/announcements/${announcement.id}`}
        className="group/title relative z-10 flex-1"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-xl leading-tight font-extrabold tracking-tight text-slate-900 transition-all duration-300 group-hover/title:bg-gradient-to-r group-hover/title:from-indigo-600 group-hover/title:to-blue-600 group-hover/title:bg-clip-text group-hover/title:text-transparent md:text-2xl">
            {announcement.title}
          </h2>
          <p className="line-clamp-2 text-[15px] leading-relaxed text-slate-500 md:text-base">
            {previewContent}
          </p>
        </div>
      </Link>

      {/* Footer: Read More */}
      <div className="relative z-10 mt-1 flex items-center justify-end border-t border-slate-100/80 pt-4">
        <Link
          href={`/forum/announcements/${announcement.id}`}
          className="group/more flex items-center gap-2 rounded-full bg-amber-50 px-5 py-2 text-sm font-bold text-amber-700 transition-all duration-300 hover:bg-amber-100 hover:shadow-sm"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover/more:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementCard;
