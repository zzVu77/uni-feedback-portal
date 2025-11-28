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
import { Suspense, useMemo } from "react";
import { reportedCommentsColumns } from "./columns";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetAllReportComments } from "@/hooks/queries/useReportCommentQueries";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/common/Loading";
import { useReportCommentFilters } from "@/hooks/filters/useReportCommentFilter";
import ReportCommentDetailDialog from "../ReportCommentDetailDialog";

export function ReportedCommentTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // --- Hooks for Filters & Navigation ---
  const filters = useReportCommentFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- Data Fetching ---
  const {
    data: reportData,
    isFetching,
    isError,
  } = useGetAllReportComments(filters);

  // --- Memoize Data & Page Count ---
  const tableData = React.useMemo(
    () => (isError ? [] : (reportData?.results ?? [])),
    [reportData, isError],
  );

  const pageCount = React.useMemo(() => {
    return reportData?.total
      ? Math.ceil(reportData.total / filters?.pageSize)
      : 0;
  }, [reportData?.total, filters.pageSize]);

  // --- LOGIC XỬ LÝ DIALOG TỪ URL ---
  const detailId = searchParams.get("id");
  const isOpenParam = searchParams.get("open") === "true";

  // Tìm report tương ứng trong list hiện tại (tableData)
  const selectedReport = useMemo(() => {
    if (!detailId || !tableData.length) return null;
    return tableData.find((item) => item.id === detailId);
  }, [detailId, tableData]);

  // Hàm xử lý đóng Dialog: Xóa params khỏi URL
  const handleCloseDialog = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    params.delete("open");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  // ---------------------------------

  // --- Table Configuration ---
  const table = useReactTable({
    data: tableData,
    columns: reportedCommentsColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // Server-side Pagination Configuration
    manualPagination: true,
    pageCount: pageCount,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(table.getState().pagination);
        const params = new URLSearchParams(searchParams.toString());

        // Update URL params
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

  // Mock data for filters (Keep UI consistent)
  const mockStatus = [
    { label: "Tất cả", value: "all" },
    { label: "Đang chờ tiếp nhận", value: "pending" },
    { label: "Đã xử lý", value: "resolved" },
  ];

  return (
    <div className="flex h-screen w-full flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
        <Suspense fallback={null}>
          <SearchBar placeholder="Tìm kiếm theo tiêu đề..." />
        </Suspense>
        <div className="flex w-full flex-row items-center justify-center gap-2 md:w-auto">
          <Suspense fallback={null}>
            <Filter type="status" items={mockStatus} />
          </Suspense>
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
                  colSpan={reportedCommentsColumns.length}
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

      {/* Dialog hiển thị khi URL có ID hợp lệ và nằm trong tableData */}
      {selectedReport && isOpenParam && (
        <ReportCommentDetailDialog
          data={selectedReport}
          open={true}
          onOpenChange={(open) => {
            if (!open) handleCloseDialog();
          }}
        />
      )}
    </div>
  );
}
