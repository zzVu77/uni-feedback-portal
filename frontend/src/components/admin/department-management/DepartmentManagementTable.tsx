"use client";

import { Loading } from "@/components/common/Loading";
import SearchBar from "@/components/common/SearchBar";
import { Badge } from "@/components/ui/badge";
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
import { useGetDepartments } from "@/hooks/queries/useDepartmentQueries";
import { cn } from "@/lib/utils";
import { DepartmentDetail, DepartmentManagementFilter } from "@/types";
import { format } from "date-fns";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Lock,
  MoreHorizontal,
  SearchX,
  Unlock,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { UpdateDepartmentDialog } from "./UpdateDepartmentDialog";
import { UpdateDepartmentStatusDialog } from "./UpdateDepartmentStatusDialog";

export const getDepartmentStatusInfo = (isActive: boolean) => {
  if (isActive) {
    return {
      label: "Đang hoạt động",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
    };
  }
  return {
    label: "Đã khóa",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: <Lock className="mr-1 h-3 w-3" />,
  };
};

export const DepartmentManagementTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const q = searchParams.get("q") || undefined;

  const queryFilter: DepartmentManagementFilter = {
    page,
    pageSize: 10,
    q,
  };

  const { data, isLoading, isFetching } = useGetDepartments(queryFilter);

  const [selectedDeptForEdit, setSelectedDeptForEdit] =
    useState<DepartmentDetail | null>(null);
  const [selectedDeptForStatus, setSelectedDeptForStatus] = useState<{
    id: string;
    isActive: boolean;
  } | null>(null);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const departments = data?.results || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / (queryFilter.pageSize || 10));

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-[24px] border border-white/60 bg-white/70 p-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-4">
      <div className="flex w-full flex-shrink-0 items-center gap-3">
        <React.Suspense fallback={null}>
          <SearchBar
            placeholder="Tìm kiếm phòng ban..."
            className="flex-1 bg-white shadow-sm"
          />
        </React.Suspense>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-[20px] border border-slate-100 bg-white/50 shadow-sm">
        <Table className={cn("w-full", departments.length === 0 && "h-full")}>
          <TableHeader className="sticky top-0 z-10 bg-indigo-50/80 backdrop-blur-md">
            <TableRow className="border-b border-indigo-100/50 hover:bg-transparent">
              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Tên phòng ban
              </TableHead>
              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Email / Số điện thoại
              </TableHead>
              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Trạng thái
              </TableHead>
              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Lượt góp ý
              </TableHead>
              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Ngày tạo
              </TableHead>
              <TableHead className="h-14 px-3 text-right text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <Loading variant="spinner" />
                </TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <SearchX className="h-8 w-8 text-slate-300" />
                    <span>Không có dữ liệu phòng ban nào</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => {
                const statusInfo = getDepartmentStatusInfo(dept.isActive);

                return (
                  <TableRow
                    key={dept.id}
                    className="group border-b border-slate-100 bg-white/40 transition-all hover:bg-indigo-50/30"
                  >
                    <TableCell className="px-3 py-4 lg:px-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-700">
                          {dept.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-3 py-4 lg:px-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-700">
                          {dept.email}
                        </span>
                        {dept.phone && (
                          <span className="text-xs text-slate-500">
                            {dept.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-3 py-4 lg:px-5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-md border px-2.5 py-0.5 font-medium",
                          statusInfo.color,
                        )}
                      >
                        <span className="flex items-center">
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </Badge>
                    </TableCell>

                    <TableCell className="px-3 py-4 lg:px-5">
                      <span className="font-semibold text-slate-700">
                        {dept.feedbackCount}
                      </span>
                    </TableCell>

                    <TableCell className="px-3 py-4 lg:px-5">
                      <span className="text-sm font-medium text-slate-600">
                        {format(new Date(dept.createdAt), "dd/MM/yyyy")}
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
                            onClick={() => setSelectedDeptForEdit(dept)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Cập nhật thông tin
                          </DropdownMenuItem>

                          {dept.isActive ? (
                            <DropdownMenuItem
                              className="text-rose-600 focus:text-rose-700"
                              onClick={() =>
                                setSelectedDeptForStatus({
                                  id: dept.id,
                                  isActive: dept.isActive,
                                })
                              }
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Khóa phòng ban
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-emerald-600 focus:text-emerald-700"
                              onClick={() =>
                                setSelectedDeptForStatus({
                                  id: dept.id,
                                  isActive: dept.isActive,
                                })
                              }
                            >
                              <Unlock className="mr-2 h-4 w-4" />
                              Mở khóa phòng ban
                            </DropdownMenuItem>
                          )}
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
            onClick={() => handlePageChange((queryFilter.page || 1) - 1)}
            disabled={(queryFilter.page || 1) <= 1}
            className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="min-w-[100px] text-center text-sm font-semibold text-slate-600">
            Trang {queryFilter.page || 1}{" "}
            <span className="mx-1 text-slate-400">/</span> {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange((queryFilter.page || 1) + 1)}
            disabled={(queryFilter.page || 1) >= pageCount}
            className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <UpdateDepartmentDialog
        isOpen={!!selectedDeptForEdit}
        onClose={() => setSelectedDeptForEdit(null)}
        department={selectedDeptForEdit}
      />
      {selectedDeptForStatus && (
        <UpdateDepartmentStatusDialog
          isOpen={!!selectedDeptForStatus}
          onClose={() => setSelectedDeptForStatus(null)}
          departmentId={selectedDeptForStatus.id}
          isActive={selectedDeptForStatus.isActive}
        />
      )}
    </div>
  );
};
