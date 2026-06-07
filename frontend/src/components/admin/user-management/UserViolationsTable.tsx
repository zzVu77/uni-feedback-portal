"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUserViolations } from "@/hooks/queries/useUserManagementQueries";
import { UserViolationsFilter } from "@/types/user-management";
import { format } from "date-fns";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import React, { useState } from "react";

interface UserViolationsTableProps {
  userId: string;
}

export const UserViolationsTable: React.FC<UserViolationsTableProps> = ({
  userId,
}) => {
  const [filter, setFilter] = useState<UserViolationsFilter>({
    page: 1,
    limit: 10,
    lookbackDays: 30, // Default 30 days, can add a filter UI if needed
  });

  const { data, isLoading } = useGetUserViolations(userId, filter);

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  const violations = data?.results || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / (filter.limit || 10));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shadow-sm ring-1 ring-rose-200">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            Lịch sử vi phạm (30 ngày gần đây)
          </h3>
          <p className="mt-0.5 text-sm font-medium text-slate-500">
            Tổng cộng: <span className="font-bold text-rose-600">{total}</span>{" "}
            vi phạm
          </p>
        </div>
      </div>

      <div className="w-full flex-1 overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="border-slate-100 bg-white hover:bg-white">
              <TableHead className="w-[15%] py-4 pl-6 font-semibold text-slate-600">
                Ngày vi phạm
              </TableHead>
              <TableHead className="w-[20%] font-semibold text-slate-600">
                Lý do báo cáo
              </TableHead>
              <TableHead className="w-[45%] font-semibold text-slate-600">
                Nội dung bình luận
              </TableHead>
              <TableHead className="w-[20%] pr-6 text-right font-semibold text-slate-600">
                Quyết định
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-48 text-center text-slate-500"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : violations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <FileText className="mb-4 h-10 w-10 text-slate-300" />
                    <p className="text-base font-medium text-slate-600">
                      Người dùng này chưa có vi phạm nào.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              violations.map((violation) => (
                <TableRow
                  key={violation.id}
                  className="border-b border-slate-100/50 hover:bg-slate-50/80"
                >
                  <TableCell className="py-4 pl-6">
                    <span className="text-sm font-medium text-slate-600">
                      {format(
                        new Date(violation.createdAt),
                        "dd/MM/yyyy HH:mm",
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-rose-600">
                      {violation.reason}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-2 text-sm text-slate-600 italic">
                      "{violation.comment?.content || "Nội dung đã bị xóa"}"
                    </p>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Badge
                      variant="outline"
                      className="rounded-md border-rose-200 bg-rose-100 px-2.5 py-0.5 text-rose-700"
                    >
                      Vi phạm
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <p className="text-sm font-medium text-slate-500">
            Hiển thị trang{" "}
            <span className="font-bold text-slate-700">{filter.page}</span> trên
            tổng số{" "}
            <span className="font-bold text-slate-700">{pageCount}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((filter.page || 1) - 1)}
              disabled={(filter.page || 1) <= 1}
              className="h-8 w-8 border-slate-200 p-0 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((filter.page || 1) + 1)}
              disabled={(filter.page || 1) >= pageCount}
              className="h-8 w-8 border-slate-200 p-0 shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
