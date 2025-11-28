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
            className="h-32 w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        <div className="mb-3 rounded-full bg-gray-100 p-3">
          <Megaphone className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Chưa có thông báo</h3>
        <p className="text-sm text-gray-500">
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
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải thêm...
          </div>
        ) : (
          !hasNextPage && (
            <p className="text-sm text-gray-400">Bạn đã xem hết thông báo.</p>
          )
        )}
      </div>
    </div>
  );
};
