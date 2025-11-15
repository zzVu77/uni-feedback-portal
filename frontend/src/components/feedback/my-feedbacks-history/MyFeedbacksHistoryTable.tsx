"use client";
import { useFeedbackFilters } from "@/hooks/filters/useFeedbackFilters";
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
import * as React from "react"; // <-- 2. Import React đầy đủ

import Filter from "@/components/common/filter/Filter";
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
import { useGetFeedbacks } from "@/hooks/queries/useFeedbackQueries";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { myFeedbacksHistoryColumns } from "./columns";
import { DepartmentOption } from "@/types/department";
import { useGetDepartmentOptions } from "@/hooks/queries/useDepartmentQueries";

function TableSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="h-10 w-full rounded-md border bg-gray-100/50" />
      <div className="h-full w-full rounded-md border bg-gray-100/50" />
    </div>
  );
}

export function MyFeedbacksHistoryTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const mockStatus = [
    { label: "Tất cả", value: "all" },

    { label: "Đang chờ tiếp nhận", value: "pending" },

    { label: "Đang xử lý", value: "in_progress" },
    { label: "Đã xử lý", value: "resolved" },

    { label: "Từ chối", value: "rejected" },
  ];

  const { data: options } = useGetDepartmentOptions();

  const departmentOptions: DepartmentOption[] = [
    { label: "Tất cả", value: "all" },
    ...(options ?? []),
  ];
  const filters = useFeedbackFilters();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data: feedbacks,
    isLoading,
    isFetching,
    isError,
  } = useGetFeedbacks(filters);

  const tableData = React.useMemo(() => feedbacks?.results ?? [], [feedbacks]);
  const pageCount = React.useMemo(() => {
    return feedbacks?.total
      ? Math.ceil(feedbacks.total / filters?.pageSize)
      : 0;
  }, [feedbacks?.total, filters.pageSize]);

  const table = useReactTable({
    data: tableData,
    columns: myFeedbacksHistoryColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // Pagination
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
        pageIndex: filters.page - 1,
        pageSize: filters.pageSize,
      },
    },
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 rounded-md bg-white p-4 text-red-500">
        Đã xảy ra lỗi khi tải dữ liệu
        <Button
          variant="destructive"
          onClick={() => {
            router.replace(pathname);
          }}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}
      <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <Suspense fallback={null}>
          <SearchBar placeholder="Tìm kiếm theo tiêu đề..." />
        </Suspense>
        <div className="flex w-full flex-row items-center justify-center gap-2 md:w-auto">
          <Suspense fallback={null}>
            <Filter type="status" items={mockStatus} />
          </Suspense>
          <Suspense fallback={null}>
            <Filter type="department" items={departmentOptions} />
          </Suspense>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-neutral-light-primary-200/60">
            {/* ... (Giữ nguyên TableHeader) ... */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
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
                  colSpan={myFeedbacksHistoryColumns.length}
                  className="h-24 text-center"
                >
                  {/* 10. (Cải tiến) Hiển thị No results chỉ khi không loading */}
                  {!isFetching && "Không tìm thấy kết quả."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
