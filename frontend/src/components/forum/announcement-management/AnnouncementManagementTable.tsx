"use client";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import Filter from "@/components/common/filter/Filter";
import { Loading } from "@/components/common/Loading";
import SearchBar from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllAnnouncementsForStaff } from "@/hooks/queries/useAnnouncementQueries"; // Import query hook
import { cn } from "@/lib/utils";
import { AnnouncementFilter } from "@/types";
import { ChevronLeft, ChevronRight, CirclePlus, SearchX } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { announcementManagementColumns } from "./columns";

const sortOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Mới nhất", value: "newest" },
  { label: "Cũ nhất", value: "oldest" },
];

export function AnnouncementManagementTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: AnnouncementFilter = React.useMemo(() => {
    const sortParam = searchParams.get("sort") as "newest" | "oldest" | null;
    return {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      q: searchParams.get("q") || undefined,
      sort:
        sortParam === "newest" || sortParam === "oldest"
          ? sortParam
          : undefined,
    };
  }, [searchParams]);

  const {
    data: announcements,
    isFetching,
    isError,
  } = useGetAllAnnouncementsForStaff(filters);

  const tableData = React.useMemo(
    () => (isError ? [] : (announcements?.results ?? [])),
    [announcements, isError],
  );

  const pageCount = React.useMemo(() => {
    return announcements?.total
      ? Math.ceil(announcements.total / (filters.pageSize || 10))
      : 0;
  }, [announcements?.total, filters.pageSize]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const table = useReactTable({
    data: tableData,
    columns: announcementManagementColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: pageCount,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(table.getState().pagination);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPagination.pageIndex + 1));
        params.set("pageSize", String(newPagination.pageSize));
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: (filters.page || 1) - 1,
        pageSize: filters.pageSize || 10,
      },
    },
  });
  return (
    <div className="flex h-full w-full flex-col gap-6 rounded-[24px] border border-white/60 bg-white/70 p-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-4">
      <div className="flex w-full flex-shrink-0 flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex w-full flex-1 items-center gap-3">
          <Suspense fallback={null}>
            <SearchBar
              placeholder="Tìm kiếm theo tiêu đề..."
              className="flex-1 bg-white shadow-sm md:max-w-md"
            />
          </Suspense>
          <Suspense fallback={null}>
            <Filter type="sort" items={sortOptions} />
          </Suspense>
        </div>

        <Link
          href="/staff/announcement-management/create"
          className="w-full md:w-auto"
        >
          <Button className="bg-blue-primary-400 hover:bg-blue-primary-600 h-11 w-full gap-2 rounded-full px-6 font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]">
            <CirclePlus className="mr-1 h-5 w-5" />
            <span className="text-sm tracking-wider uppercase">
              Tạo thông báo
            </span>
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto rounded-[20px] border border-slate-100 bg-white/50 shadow-sm">
        <Table className={cn("w-full", tableData.length === 0 && "h-full")}>
          <TableHeader className="sticky top-0 z-10 bg-indigo-50/80 backdrop-blur-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-indigo-100/50 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="group border-b border-slate-100 bg-white/40 transition-all hover:bg-indigo-50/30"
                  key={row.id}
                  data-state={row.getIsSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-4 text-sm text-slate-700 lg:px-5"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={announcementManagementColumns.length}
                  className="h-24 font-medium"
                >
                  {!isFetching && (
                    <div className="flex flex-col items-center justify-center gap-2 text-center text-slate-500">
                      <SearchX className="h-8 w-8 text-slate-300" />
                      <span>Không có dữ liệu để hiển thị</span>
                    </div>
                  )}
                  {isFetching && <Loading variant="spinner" />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-shrink-0 items-center justify-center gap-5 pt-4">
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
