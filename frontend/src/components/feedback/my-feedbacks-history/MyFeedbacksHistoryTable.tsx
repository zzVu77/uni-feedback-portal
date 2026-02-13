"use client";
import CommonFilter from "@/components/common/CommonFilter";
import { Loading } from "@/components/common/Loading";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useFeedbackFilters } from "@/hooks/filters/useFeedbackFilters";
import { useGetFeedbacks } from "@/hooks/queries/useFeedbackQueries";
import {
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  SearchX,
  Tag,
  ListFilter,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

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
    <div className="relative flex h-full w-full flex-col gap-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="flex w-full flex-shrink-0 items-center gap-3">
        <Suspense fallback={null}>
          <SearchBar
            placeholder="Tìm kiếm theo tiêu đề..."
            className="flex-1 bg-white shadow-sm"
          />
        </Suspense>

        {/* Desktop Filters */}
        <div className="hidden items-center gap-3 md:flex">
          <CommonFilter.DepartmentSelection />
          <CommonFilter.StatusSelection />
          <CommonFilter.CategorySelection />
        </div>

        {/* Mobile Filter Drawer */}
        <div className="md:hidden">
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

      <div className="flex-1 overflow-y-auto pr-2">
        {tableData.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tableData.map((feedback) => (
              <Link
                href={`/student/my-feedbacks/${feedback.id}`}
                key={feedback.id}
                className="group block h-full"
              >
                <Card className="flex h-full flex-col justify-between gap-2 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex flex-col items-start justify-between gap-3">
                      <div className="flex-shrink-0">
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
                      </div>
                      <h3
                        className="line-clamp-2 text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600"
                        title={feedback.subject}
                      >
                        {feedback.subject}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5">
                        <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                        <span
                          className="truncate text-xs font-medium text-slate-600"
                          title={feedback.department.name}
                        >
                          {feedback.department.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5">
                        <Tag className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                        <span
                          className="truncate text-xs font-medium text-slate-600"
                          title={feedback.category.name}
                        >
                          {feedback.category.name}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-slate-100 pt-3">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CalendarClock className="h-3.5 w-3.5" />
                        <time>
                          {new Date(feedback.createdAt).toLocaleString("vi-VN")}
                        </time>
                      </div>
                      <div className="flex items-center text-xs font-medium text-blue-600 opacity-0 transition-all group-hover:opacity-100">
                        Chi tiết
                        <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardFooter>
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
        <div className="flex flex-shrink-0 items-center justify-center gap-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-slate-600">
            Trang {filters.page} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= pageCount}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
