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
import { Suspense } from "react";
import { dummyData, myFeedbacksHistoryColumns } from "./columns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ListDepartmentFeedback() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: dummyData,
    columns: myFeedbacksHistoryColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });
  const mockStatus = [
    { label: "Tất cả", value: "all" },
    { label: "Đang chờ tiếp nhận", value: "pending" },
    { label: "Đang xử lý", value: "in-progress" },
    { label: "Đã xử lý", value: "resolved" },
    { label: "Từ chối", value: "rejected" },
  ];
  const departmentOptions = [
    { label: "All", value: "all" },
    { label: "Khoa Công nghệ thông tin", value: "fit" },
    { label: "Khoa Đào tạo quốc tế", value: "fie" },
    { label: "Thư viện", value: "library" },
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
          <Suspense fallback={null}>
            <Filter type="department" items={departmentOptions} />
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
                  colSpan={myFeedbacksHistoryColumns.length}
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
