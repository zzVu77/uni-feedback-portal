"use client";

import StatusBadge from "@/components/common/StatusBadge";
import StaffAction from "@/components/feedback/staff-feedbacks-list/StaffAction";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RelatedFeedbackItem } from "@/types";
import { FileText, Inbox } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RelatedFeedbackTableProps {
  // feedbackId: string;
  feedbacksList: RelatedFeedbackItem[] | [];
  isLoading: boolean;
  isError: boolean;
  originalFeedbackId?: string;
  isReadOnly?: boolean;
}

export function RelatedFeedbackTable({
  feedbacksList,
  isLoading,
  isError,
  originalFeedbackId,
  isReadOnly = false,
}: RelatedFeedbackTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set([]));
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = feedbacksList.map((fb) => fb.id);

      if (originalFeedbackId) {
        allIds.unshift(originalFeedbackId);
      }

      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);

    if (checked) {
      newSelected.add(id);

      if (originalFeedbackId) {
        newSelected.delete(originalFeedbackId);

        setSelectedIds(new Set([originalFeedbackId, ...newSelected]));

        return;
      }
    } else {
      newSelected.delete(id);

      if (
        originalFeedbackId &&
        newSelected.size === 1 &&
        newSelected.has(originalFeedbackId)
      ) {
        newSelected.delete(originalFeedbackId);
      }
    }

    setSelectedIds(newSelected);
  };

  const isAllSelected =
    feedbacksList.length > 0 && selectedIds.size === feedbacksList.length;
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < feedbacksList.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 animate-pulse rounded-full bg-slate-50 p-4">
          <Inbox className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="mb-1 font-medium text-slate-900">Đang tải...</h3>
      </div>
    );
  }

  if (isError || feedbacksList.length - 1 === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 rounded-full bg-slate-50 p-4">
          <Inbox className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mb-1 font-medium text-slate-900">
          Không tìm thấy góp ý liên quan
        </h3>
        <p className="max-w-sm text-sm text-slate-500">
          Không có góp ý nào có nội dung tương tự.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && !isReadOnly && (
        <div className="animate-in slide-in-from-top-2 fade-in flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">
              {/* -1 because we don't count the original feedback */}
              Đã chọn {selectedIds.size - 1} góp ý
            </span>
          </div>
          <div>
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-9 bg-blue-600 text-white shadow-none hover:bg-blue-700"
                >
                  Xử lý hàng loạt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-auto md:max-w-6xl">
                <DialogHeader>
                  <DialogTitle className="text-md md:text-xl">
                    Xử lý hàng loạt ({selectedIds.size} góp ý)
                  </DialogTitle>
                  <DialogDescription className="text-xs md:text-sm">
                    Kiểm tra lại danh sách các góp ý đã chọn trước khi thực hiện
                    hành động.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-start gap-2 overflow-auto md:flex-row">
                  {/* Left side: List of selected feedbacks */}
                  <ScrollArea className="order-2 h-full w-full rounded-xl border border-slate-200 bg-slate-50/30 md:order-1 md:w-3/5">
                    <div className="flex max-h-[70vh] flex-col gap-3 p-4">
                      {Array.from(selectedIds).map((id) => {
                        const fb = feedbacksList.find((f) => f.id === id);
                        return (
                          <Link
                            href={`/staff/list-feedbacks/${fb?.id}`}
                            key={fb?.id}
                            target="_blank"
                          >
                            <div
                              className={cn(
                                "rounded-xl border p-4 text-sm shadow-sm transition-colors",
                                fb?.id === originalFeedbackId
                                  ? "border-green-400 bg-green-200/50"
                                  : "border-slate-200 bg-white hover:border-blue-200",
                              )}
                            >
                              <div className="text-base font-semibold text-slate-900">
                                {fb?.subject}
                              </div>
                              <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                  <FileText className="h-4 w-4" /> Người gửi:{" "}
                                  <span className="font-medium text-slate-700">
                                    {fb?.student?.fullName || "Ẩn danh"}
                                  </span>
                                </span>
                                <span className="flex items-center gap-1.5 border-l border-slate-200 pl-4 text-xs text-slate-400">
                                  {new Date(
                                    fb?.createdAt ?? "",
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Right side: StaffAction */}
                  <div className="order-1 w-full md:order-2 md:w-2/5">
                    <StaffAction
                      feedbackIds={Array.from(selectedIds)}
                      currentStatus="PENDING"
                      onSuccess={() => {
                        setIsBulkDialogOpen(false);
                        setSelectedIds(new Set());
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Data Table */}
      <ScrollArea className="h-full w-full rounded-md border border-slate-100 whitespace-nowrap">
        <div className="max-h-[49vh] w-full">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                {!isReadOnly && (
                  <TableHead className="w-[50px] px-4 py-4">
                    <Checkbox
                      checked={
                        isAllSelected ||
                        (isIndeterminate ? "indeterminate" : false)
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                <TableHead className="px-4 py-4 font-medium text-slate-900">
                  Tiêu đề
                </TableHead>
                <TableHead className="px-4 py-4 font-medium text-slate-900">
                  Người gửi
                </TableHead>
                <TableHead className="px-4 py-4 font-medium text-slate-900">
                  Ngày gửi
                </TableHead>
                <TableHead className="px-4 py-4 text-right font-medium text-slate-900">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacksList.map(
                (feedback) =>
                  feedback.id !== originalFeedbackId && (
                    <TableRow
                      key={feedback.id}
                      className="group border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                      data-state={selectedIds.has(feedback.id) && "selected"}
                    >
                      {!isReadOnly && (
                        <TableCell className="px-4 py-4">
                          <Checkbox
                            checked={selectedIds.has(feedback.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOne(feedback.id, checked as boolean)
                            }
                            aria-label={`Select feedback ${feedback.id}`}
                          />
                        </TableCell>
                      )}
                      <Link
                        href={`/staff/list-feedbacks/${feedback?.id}`}
                        key={feedback.id}
                        target="_blank"
                      >
                        <TableCell className="px-4 py-4">
                          <div className="flex items-start gap-2">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                            <span
                              className="line-clamp-2 cursor-pointer font-medium text-slate-900 transition-colors hover:text-blue-600"
                              title={feedback.subject}
                            >
                              {feedback.subject}
                            </span>
                          </div>
                        </TableCell>
                      </Link>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-slate-600">
                        {feedback?.student?.fullName || "Ẩn danh"}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-slate-600">
                        {new Date(feedback.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right">
                        <div className="flex justify-end">
                          <StatusBadge type={feedback.currentStatus} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
