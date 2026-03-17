import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateReportComment } from "@/hooks/queries/useReportCommentQueries";
import { ReportCommentDetail } from "@/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  AlertCircle,
  Calendar,
  Check,
  ExternalLink,
  MessageSquare,
  Quote,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  children?: React.ReactNode;
  data: ReportCommentDetail;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ReportCommentDetailDialog = ({
  children,
  data,
  open,
  onOpenChange,
}: Props) => {
  const {
    id,
    reason,
    status,
    adminResponse,
    createdAt,
    comment,
    reportedBy,
    target,
  } = data;

  const { mutate: updateReport } = useUpdateReportComment(id);
  const isResolved = status === "RESOLVED";

  const handleDelete = () => {
    updateReport({ status: "RESOLVED", isDeleted: true });
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleResolve = () => {
    updateReport({ status: "RESOLVED", isDeleted: false });
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-xl bg-white p-0 sm:h-fit lg:h-auto">
        <DialogTitle className="sr-only">Chi tiết báo cáo</DialogTitle>

        {/* Header */}
        <div className="flex flex-col items-start gap-2 border-b border-slate-100 bg-slate-50/50 pt-4 pr-10 pl-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              Chi tiết báo cáo vi phạm
            </h2>
          </div>
          <StatusBadge type={status} />
        </div>

        <ScrollArea className="max-h-[70vh] w-full">
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* Section 1: Comment Content (The Evidence) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Nội dung bình luận
                </label>
                <Link
                  href={
                    target.targetType === "FORUM_POST"
                      ? `/forum/posts/${target.targetInfo.id}`
                      : `/forum/announcements/${target.targetInfo.id}`
                  }
                  target="_blank"
                  className="group flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  Xem bài viết gốc
                  <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-500" />
                <div className="p-4 pl-5">
                  <p className="text-base leading-relaxed font-medium text-slate-800">
                    "{comment.content}"
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="font-medium text-slate-700">
                        {comment.user.fullName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(comment.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Report Context */}
            <div className="rounded-xl border border-red-100 bg-red-50/30 p-4">
              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700">
                <AlertCircle className="h-4 w-4" />
                Thông tin tố cáo
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">
                    Người báo cáo
                  </span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <User className="h-4 w-4 text-slate-400" />
                    {reportedBy.fullName}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">
                    Thời gian báo cáo
                  </span>
                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(createdAt).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <span className="text-xs font-medium text-slate-500">
                    Lý do vi phạm
                  </span>
                  <div className="rounded-md border border-red-100 bg-white px-3 py-2 text-sm font-medium text-red-600">
                    {reason}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Admin Response (If any) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Quote className="h-4 w-4 text-green-600" />
                Ghi chú của quản trị viên
              </label>
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">
                {adminResponse ? (
                  <span className="text-slate-800">{adminResponse}</span>
                ) : (
                  <span className="text-slate-400 italic">
                    Chưa có ghi chú xử lý.
                  </span>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <DialogFooter className="gap-2 border-t border-slate-100 bg-slate-50/50 p-4 sm:justify-end">
          {isResolved ? (
            <Button
              variant="outline"
              onClick={() => onOpenChange && onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Đóng
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <ConfirmationDialog
                title="Xác nhận không vi phạm?"
                description="Bình luận này sẽ được giữ lại và đánh dấu là đã xử lý. Báo cáo sẽ được đóng."
                onConfirm={handleResolve}
                confirmText="Xác nhận"
              >
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 sm:w-auto"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Giữ lại (Không vi phạm)
                </Button>
              </ConfirmationDialog>

              <ConfirmationDialog
                title="Xác nhận xóa bình luận?"
                description="Bình luận này sẽ bị ẩn khỏi hệ thống vĩnh viễn. Hành động này không thể hoàn tác."
                onConfirm={handleDelete}
                confirmText="Xóa bình luận"
              >
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa nội dung
                </Button>
              </ConfirmationDialog>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportCommentDetailDialog;
