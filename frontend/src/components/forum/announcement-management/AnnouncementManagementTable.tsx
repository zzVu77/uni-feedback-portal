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
import { useUser } from "@/context/UserContext"; // Import User Context
import { useGetAnnouncements } from "@/hooks/queries/useAnnouncementQueries"; // Import query hook
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

  // 1. Get User Context to retrieve departmentId
  const { user } = useUser();
  const departmentId = user?.department?.id ?? undefined;

  // 2. Handle URL Search Params for pagination & filtering
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create filters object
  const filters: AnnouncementFilter = React.useMemo(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      q: searchParams.get("q") || undefined,
      departmentId: departmentId,
    };
  }, [searchParams, departmentId]);

  // 3. Fetch Data using React Query
  const {
    data: announcements,
    isFetching,
    isError,
  } = useGetAnnouncements(filters);

  const tableData = React.useMemo(
    () => (isError ? [] : (announcements?.results ?? [])),
    [announcements, isError],
  );

  const pageCount = React.useMemo(() => {
    return announcements?.total
      ? Math.ceil(announcements.total / (filters.pageSize || 10))
      : 0;
  }, [announcements?.total, filters.pageSize]);

  const table = useReactTable({
    data: tableData,
    columns: announcementManagementColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // Pagination logic relies on manualPagination
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true, // IMPORTANT: Server-side pagination
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
    <div className="relative flex h-screen w-full flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <Suspense fallback={null}>
          <SearchBar placeholder="Tìm kiếm theo tiêu đề..." />
        </Suspense>
        <div className="flex w-full flex-row items-center justify-center gap-2 md:w-auto">
          <Suspense fallback={null}>
            <Filter type="sort" items={sortOptions} />
          </Suspense>
          <Link href="/staff/announcement-management/create">
            <Button variant={"primary"} className="rounded-lg">
              <CirclePlus className="h-5 w-5" />
              Tạo thông báo mới
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table className={cn(tableData.length === 0 && "h-[70vh]")}>
          <TableHeader className="bg-neutral-light-primary-200/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  className="hover:bg-blue-primary-100/40 text-xs lg:text-[13px]"
                  key={row.id}
                  data-state={row.getIsSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center font-medium text-red-500"
                >
                  {!isFetching && (
                    <div className="flex flex-row items-center justify-center gap-2 text-center">
                      <SearchX />
                      Không có dữ liệu để hiển thị
                    </div>
                  )}
                  {isFetching && <Loading variant="spinner" />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
