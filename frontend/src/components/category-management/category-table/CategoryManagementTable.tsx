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
import { useCategoryFilters } from "@/hooks/filters/useCategoryFilters";
import {
  useCreateCategory,
  useGetAllCategories,
} from "@/hooks/queries/useCategoryQueries";
import { cn } from "@/lib/utils";
import { CreateCategoryPayload } from "@/types/category";
import { ChevronLeft, ChevronRight, PlusCircle, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryDialog } from "../CategoryDialog";
import { categoryColumns } from "./columns";

export function CategoryManagementTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // --- Hooks for Filters & Navigation ---
  const filters = useCategoryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- Data Fetching ---
  const {
    data: categoryData,
    isFetching,
    isError,
  } = useGetAllCategories(filters);

  // --- Mutation ---
  const { mutateAsync: createCategory } = useCreateCategory();

  // --- Memoize Data & Page Count ---
  const tableData = React.useMemo(
    () => (isError ? [] : (categoryData?.results ?? [])),
    [categoryData, isError],
  );

  const pageCount = React.useMemo(() => {
    return categoryData?.total
      ? Math.ceil(categoryData.total / filters?.pageSize)
      : 0;
  }, [categoryData?.total, filters.pageSize]);

  const handleCreateCategory = async (values: CreateCategoryPayload) => {
    await createCategory(values);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // --- Table Configuration ---
  const table = useReactTable({
    data: tableData,
    columns: categoryColumns,
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
        <React.Suspense fallback={null}>
          <SearchBar
            placeholder="Tìm kiếm danh mục..."
            className="flex-1 bg-white shadow-sm"
          />
        </React.Suspense>

        <CategoryDialog mode="create" onSubmit={handleCreateCategory}>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Thêm Danh Mục</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </CategoryDialog>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-slate-100">
        <Table
          className={cn("min-w-[800px]", tableData.length === 0 && "h-full")}
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
                  colSpan={categoryColumns.length}
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
    </div>
  );
}
