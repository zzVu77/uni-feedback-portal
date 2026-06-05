"use client";
import CommonFilter from "@/components/common/CommonFilter";
import { Loading } from "@/components/common/Loading";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFeedbackFilters } from "@/hooks/filters/useFeedbackFilters";
import { useGetFeedbacks } from "@/hooks/queries/useFeedbackQueries";
import {
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  SearchX,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";

export function MyFeedbacksHistoryTable() {
  const filters = useFeedbackFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    data: feedbacks,
    isFetching,
    isError,
  } = useGetFeedbacks({
    ...filters,
    pageSize: 12,
  });

  const tableData = React.useMemo(
    () => (isError ? [] : (feedbacks?.results ?? [])),
    [feedbacks, isError],
  );

  const pageCount = React.useMemo(() => {
    return feedbacks?.total
      ? Math.ceil(feedbacks.total / filters?.pageSize)
      : 0;
  }, [feedbacks?.total, filters.pageSize]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-5">
      <div className="flex w-full flex-shrink-0 flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex w-full flex-1 items-center gap-3 md:w-auto">
          <Suspense fallback={null}>
            <SearchBar
              placeholder="Tìm kiếm theo tiêu đề..."
              className="flex-1 bg-white shadow-sm"
            />
          </Suspense>
        </div>

        {/* Desktop Filters */}
        <div className="hidden items-center gap-2 md:flex">
          <CommonFilter.DepartmentSelection />
          <CommonFilter.StatusSelection />
          <CommonFilter.CategorySelection />
        </div>

        {/* Mobile Filter Drawer */}
        <div className="flex w-full gap-3 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ListFilter className="h-4 w-4" />
                Bộ lọc
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl px-6 pb-8">
              <SheetHeader className="px-0 text-left">
                <SheetTitle className="text-lg font-bold text-slate-800">
                  Bộ lọc tìm kiếm
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-4">
                <div className="flex flex-col gap-1.5">
                  <span className="ml-1 text-sm font-medium text-slate-700">
                    Phòng ban
                  </span>
                  <div className="w-full [&>button]:w-full">
                    <CommonFilter.DepartmentSelection />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="ml-1 text-sm font-medium text-slate-700">
                    Trạng thái
                  </span>
                  <div className="w-full [&>button]:w-full">
                    <CommonFilter.StatusSelection />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="ml-1 text-sm font-medium text-slate-700">
                    Danh mục
                  </span>
                  <div className="w-full [&>button]:w-full">
                    <CommonFilter.CategorySelection />
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-row items-center gap-3 px-0 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 rounded-xl bg-red-400 text-white"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("departmentId");
                    params.delete("status");
                    params.delete("categoryId");
                    params.delete("q");
                    params.delete("page");
                    router.replace(`${pathname}?${params.toString()}`, {
                      scroll: false,
                    });
                  }}
                >
                  Xóa bộ lọc
                </Button>
                <SheetClose asChild>
                  <Button className="h-10 flex-[2] bg-blue-600 hover:bg-blue-700">
                    Xem kết quả
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {tableData.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tableData.map((feedback) => (
              <Link
                href={`/student/my-feedbacks/${feedback.id}`}
                key={feedback.id}
                className="group block h-full"
              >
                <Card className="flex h-full flex-col justify-between gap-0 rounded-[20px] border border-white/60 bg-white/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:bg-white hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)]">
                  <div className="space-y-2">
                    <div className="flex flex-col items-start gap-2">
                      <StatusBadge
                        type={
                          feedback.currentStatus as
                            | "PENDING"
                            | "IN_PROGRESS"
                            | "RESOLVED"
                            | "REJECTED"
                            | "CLOSED"
                        }
                      />
                      <h3
                        className="line-clamp-2 text-[15px] leading-snug font-bold text-slate-800 transition-colors group-hover:text-indigo-600"
                        title={feedback.subject}
                      >
                        {feedback.subject}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <div className="flex items-center gap-1.5 rounded-full border border-indigo-50 bg-indigo-50/50 px-2.5 py-1">
                        <Building2 className="h-3 w-3 flex-shrink-0 text-indigo-500" />
                        <span
                          className="truncate text-[11px] font-semibold text-indigo-700"
                          title={feedback.department.name}
                        >
                          {feedback.department.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-indigo-50 bg-indigo-50/50 px-2.5 py-1">
                        <Tag className="h-3 w-3 flex-shrink-0 text-indigo-500" />
                        <span
                          className="truncate text-[11px] font-semibold text-indigo-700"
                          title={feedback.category.name}
                        >
                          {feedback.category.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex w-full items-center justify-between border-t border-slate-100/60 pt-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <CalendarClock className="h-3.5 w-3.5" />
                      <time>
                        {new Date(feedback.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <div className="flex -translate-x-2 items-center text-[12px] font-semibold text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      Chi tiết
                      <ChevronRight className="ml-0.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-slate-500">
            {!isFetching ? (
              <>
                <SearchX className="h-12 w-12 text-slate-300" />
                <span className="text-lg font-medium">
                  Không có dữ liệu để hiển thị
                </span>
              </>
            ) : (
              <Loading variant="spinner" />
            )}
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex flex-shrink-0 items-center justify-center gap-5 pt-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="min-w-[100px] text-center text-sm font-semibold text-slate-600">
            Trang {filters.page} <span className="mx-1 text-slate-400">/</span>{" "}
            {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= pageCount}
            className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
