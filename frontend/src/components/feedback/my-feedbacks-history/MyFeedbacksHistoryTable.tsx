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

import CommonFilter from "@/components/common/CommonFilter";
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
import { useGetFeedbacks } from "@/hooks/queries/useFeedbackQueries";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { myFeedbacksHistoryColumns } from "./columns";

export function MyFeedbacksHistoryTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const filters = useFeedbackFilters();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: feedbacks, isFetching, isError } = useGetFeedbacks(filters);

  const tableData = React.useMemo(
    () => (isError ? [] : (feedbacks?.results ?? [])),
    [feedbacks],
  );
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

  // if (isError) {
  //   return (
  //     <div className="flex h-screen w-full flex-col items-center justify-center gap-4 rounded-md bg-white p-4 text-red-500">
  //       Đã xảy ra lỗi khi tải dữ liệu
  //       <Button
  //         variant="destructive"
  //         onClick={() => {
  //           router.replace(pathname);
  //         }}
  //       >
  //         Thử lại
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="relative flex h-screen w-full flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="flex w-full flex-wrap items-start justify-center gap-2 md:items-center md:justify-start xl:flex-row xl:flex-nowrap">
        <Suspense fallback={null}>
          <SearchBar placeholder="Tìm kiếm theo tiêu đề..." />
        </Suspense>

        <div className="flex w-full flex-wrap items-start justify-center gap-2 md:flex-row md:flex-nowrap md:items-center md:justify-center xl:w-fit">
          <CommonFilter.DepartmentSelection />
          <CommonFilter.StatusSelection />
          <CommonFilter.CategorySelection />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table className={cn(tableData.length === 0 && "h-[70vh]")}>
          <TableHeader className="bg-neutral-light-primary-200/60">
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
                  className="h-24 font-medium text-red-500"
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
