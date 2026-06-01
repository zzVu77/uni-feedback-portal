/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, Megaphone } from "lucide-react";

import { useGetInfiniteAnnouncements } from "@/hooks/queries/useAnnouncementQueries";
import AnnouncementCard from "@/components/forum/AnnouncementCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  departmentId: string;
}

export const DepartmentAnnouncementList: React.FC<Props> = ({
  departmentId,
}) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useGetInfiniteAnnouncements({ departmentId, page: 1, pageSize: 5 });

  const announcements = data?.pages.flatMap((page) => page.results) || [];

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 w-full rounded-[24px] border border-white/60 bg-white/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm"
          >
            <Skeleton className="mb-2 h-6 w-3/4" />
            <Skeleton className="mb-4 h-4 w-1/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // State: Lỗi
  if (isError) {
    return (
      <div className="py-8 text-center text-red-500">
        Đã có lỗi xảy ra khi tải thông báo.
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-indigo-200 bg-white/50 py-16 text-center shadow-sm backdrop-blur-sm">
        <div className="mb-4 rounded-full bg-indigo-50 p-4">
          <Megaphone className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Chưa có thông báo</h3>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Phòng ban này chưa đăng tải thông báo nào.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>

      <div ref={ref} className="flex w-full justify-center py-4">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> Đang
            tải thêm...
          </div>
        ) : (
          !hasNextPage &&
          announcements.length > 0 && (
            <p className="text-sm font-medium text-slate-400">
              Bạn đã xem hết thông báo.
            </p>
          )
        )}
      </div>
    </div>
  );
};
