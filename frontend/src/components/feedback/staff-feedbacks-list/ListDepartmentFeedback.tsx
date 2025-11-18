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
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeedbackStatus } from "@/constants/data";
import { useFeedbackFilters } from "@/hooks/filters/useFeedbackFilters";
import { useGetStaffFeedbacks } from "@/hooks/queries/useFeedbackQueries";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { staffFeedbackColumns } from "./columns";

export function ListDepartmentFeedback() {
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
  const {
    data: feedbacks,
    isLoading,
    isFetching,
    isError,
  } = useGetStaffFeedbacks(filters);
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
    columns: staffFeedbackColumns,
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

  return (
    <div className="flex h-screen w-full flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/50">
          <Loading variant="spinner" />
        </div>
      )}
      <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <Suspense fallback={null}>
          <SearchBar placeholder="Tìm kiếm theo tiêu đề..." />
        </Suspense>
        <div className="flex w-full flex-row items-center justify-center gap-2 md:w-auto">
          <Suspense fallback={null}>
            <Filter type="status" items={FeedbackStatus} />
          </Suspense>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
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
                  colSpan={staffFeedbackColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
    </div>
  );
}
