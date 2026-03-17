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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useReportCommentFilters } from "@/hooks/filters/useReportCommentFilter";
import { useGetAllReportComments } from "@/hooks/queries/useReportCommentQueries";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ListFilter, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import ReportCommentDetailDialog from "../ReportCommentDetailDialog";
import { reportedCommentsColumns } from "./columns";

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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
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

  return (
    <div className="flex h-full w-full flex-col gap-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="flex w-full flex-shrink-0 items-center gap-3">
        <Suspense fallback={null}>
          <SearchBar
            placeholder="Tìm kiếm báo cáo..."
            className="flex-1 bg-white shadow-sm"
          />
        </Suspense>

        {/* Desktop Filters */}
        <div className="hidden items-center gap-3 md:flex">
          <CommonFilter.ReportStatusSelection />
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
                    Trạng thái
                  </span>
                  <div className="w-full [&>button]:w-full">
                    <CommonFilter.ReportStatusSelection />
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
                    params.delete("status");
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
                  <Button className="h-10 flex-[2] bg-blue-600 text-white hover:bg-blue-700">
                    Xem kết quả
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-slate-100">
        <Table
          className={cn("min-w-[1000px]", tableData.length === 0 && "h-full")}
        >
          <TableHeader className="sticky top-0 z-10 bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 text-xs font-semibold tracking-wider text-slate-500 uppercase"
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
                  className="group border-b border-slate-50 transition-colors hover:bg-slate-50/80"
                  key={row.id}
                  data-state={row.getIsSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4">
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
