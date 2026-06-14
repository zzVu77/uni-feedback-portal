"use client";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Loading } from "@/components/common/Loading";
import SearchBar from "@/components/common/SearchBar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToxicKeywordsFilters } from "@/hooks/filters/useToxicKeywordsFilters";
import {
  useDeleteToxicKeyword,
  useGetToxicKeywords,
} from "@/hooks/queries/useToxicKeywordsQueries";
import { cn } from "@/lib/utils";
import {
  SortDirection,
  ToxicKeywordResponse,
  ToxicKeywordSortOption,
} from "@/types/toxic-keywords";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  MoreHorizontal,
  SearchX,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { UpdateKeywordDialog } from "./UpdateKeywordDialog";

export const KeywordsManagementTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useToxicKeywordsFilters();

  const { data, isLoading, isFetching } = useGetToxicKeywords(filters);
  const { mutate: deleteKeyword, isPending: isDeleting } =
    useDeleteToxicKeyword();

  const [selectedKeywordForEdit, setSelectedKeywordForEdit] =
    useState<ToxicKeywordResponse | null>(null);
  const [selectedKeywordForDelete, setSelectedKeywordForDelete] =
    useState<ToxicKeywordResponse | null>(null);

  const keywords = data?.results || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / (filters.limit || 10));

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSort = (field: ToxicKeywordSortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentOrderDirection = filters.orderDirection;

    if (filters.orderBy === field) {
      params.set(
        "orderDirection",
        currentOrderDirection === SortDirection.ASC
          ? SortDirection.DESC
          : SortDirection.ASC,
      );
    } else {
      params.set("orderBy", field);
      params.set("orderDirection", SortDirection.DESC); // default desc when changing field
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderSortIcon = (field: ToxicKeywordSortOption) => {
    if (filters.orderBy !== field)
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    return filters.orderDirection === SortDirection.ASC ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  const handleConfirmDelete = () => {
    if (!selectedKeywordForDelete) return;

    deleteKeyword(selectedKeywordForDelete.id, {
      onSuccess: () => {
        setSelectedKeywordForDelete(null);
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
      {/* Header & Search */}
      <div className="flex w-full flex-shrink-0 flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <React.Suspense fallback={null}>
          <SearchBar
            placeholder="Tìm kiếm từ khóa..."
            className="w-full flex-1 bg-white shadow-sm md:max-w-md"
          />
        </React.Suspense>

        {/* Explicit Sort Filters */}
        <div className="flex w-full items-center gap-3 md:w-auto">
          <Select
            value={filters.orderBy || ToxicKeywordSortOption.DATE}
            onValueChange={(val) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("orderBy", val);
              // reset to page 1 on filter change
              params.set("page", "1");
              router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            <SelectTrigger className="w-full bg-white md:w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ToxicKeywordSortOption.KEYWORD}>
                Từ khóa
              </SelectItem>
              <SelectItem value={ToxicKeywordSortOption.DATE}>
                Ngày tạo
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.orderDirection || SortDirection.DESC}
            onValueChange={(val) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("orderDirection", val);
              params.set("page", "1");
              router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            <SelectTrigger className="w-full bg-white md:w-[160px]">
              <SelectValue placeholder="Thứ tự" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortDirection.ASC}>Tăng dần</SelectItem>
              <SelectItem value={SortDirection.DESC}>Giảm dần</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-[20px] border border-slate-100 bg-white/50 shadow-sm">
        <Table className={cn("w-full", keywords.length === 0 && "h-full")}>
          <TableHeader className="sticky top-0 z-10 bg-indigo-50/80 backdrop-blur-md">
            <TableRow className="border-b border-indigo-100/50 hover:bg-transparent">
              <TableHead className="h-14 w-[80px] px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                STT
              </TableHead>
              <TableHead
                className="h-14 cursor-pointer px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase transition-colors select-none hover:bg-indigo-100/50 lg:px-5"
                onClick={() => handleSort(ToxicKeywordSortOption.KEYWORD)}
              >
                <div className="flex items-center">
                  Từ khóa
                  {renderSortIcon(ToxicKeywordSortOption.KEYWORD)}
                </div>
              </TableHead>
              <TableHead
                className="h-14 w-[200px] cursor-pointer px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase transition-colors select-none hover:bg-indigo-100/50 lg:px-5"
                onClick={() => handleSort(ToxicKeywordSortOption.DATE)}
              >
                <div className="flex items-center">
                  Ngày tạo
                  {renderSortIcon(ToxicKeywordSortOption.DATE)}
                </div>
              </TableHead>
              <TableHead className="h-14 w-[120px] px-3 text-right text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <Loading variant="spinner" />
                </TableCell>
              </TableRow>
            ) : keywords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <SearchX className="h-8 w-8 text-slate-300" />
                    <span>Không có từ khóa nào để hiển thị</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              keywords.map((keyword, index) => {
                const globalIndex =
                  ((filters.page || 1) - 1) * (filters.limit || 10) + index + 1;

                return (
                  <TableRow
                    key={keyword.id}
                    className="group border-b border-slate-100 bg-white/40 transition-all hover:bg-indigo-50/30"
                  >
                    <TableCell className="px-3 py-4 font-medium text-slate-500 lg:px-5">
                      {globalIndex}
                    </TableCell>

                    <TableCell className="px-3 py-4 lg:px-5">
                      <span className="font-semibold text-slate-900">
                        {keyword.keyword}
                      </span>
                    </TableCell>

                    <TableCell className="px-3 py-4 lg:px-5">
                      <span className="text-sm font-medium text-slate-600">
                        {format(
                          new Date(keyword.createdAt),
                          "dd/MM/yyyy HH:mm",
                        )}
                      </span>
                    </TableCell>

                    <TableCell className="px-3 py-4 text-right lg:px-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-white/60"
                          >
                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => setSelectedKeywordForEdit(keyword)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa từ khóa
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-rose-600 focus:text-rose-700"
                            onClick={() => setSelectedKeywordForDelete(keyword)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa từ khóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex flex-shrink-0 items-center justify-center gap-5 pt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange((filters.page || 1) - 1)}
            disabled={(filters.page || 1) <= 1}
            className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="min-w-[100px] text-center text-sm font-semibold text-slate-600">
            Trang {filters.page || 1}{" "}
            <span className="mx-1 text-slate-400">/</span> {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange((filters.page || 1) + 1)}
            disabled={(filters.page || 1) >= pageCount}
            className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Modals */}
      {selectedKeywordForEdit && (
        <UpdateKeywordDialog
          isOpen={!!selectedKeywordForEdit}
          onClose={() => setSelectedKeywordForEdit(null)}
          keywordData={selectedKeywordForEdit}
        />
      )}

      {selectedKeywordForDelete && (
        <ConfirmationDialog
          isOpen={!!selectedKeywordForDelete}
          onOpenChange={(open) => {
            if (!open) setSelectedKeywordForDelete(null);
          }}
          title="Xóa từ khóa cấm"
          description={`Bạn có chắc chắn muốn xóa từ khóa "${selectedKeywordForDelete.keyword}" không? Hành động này không thể hoàn tác.`}
          confirmText="Xác nhận xóa"
          cancelText="Hủy"
          isDestructive={true}
          onConfirm={handleConfirmDelete}
          isConfirmDisabled={isDeleting}
        />
      )}
    </div>
  );
};
