"use client";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useUpdateReportComment } from "@/hooks/queries/useReportCommentQueries";
import { ReportCommentDetail } from "@/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  CalendarClock,
  Check,
  Eye,
  Target,
  TextInitial,
  Trash,
  User,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ActionCell = ({ row }: { row: Row<ReportCommentDetail> }) => {
  const source = row.original;
  const { mutate: updateReport } = useUpdateReportComment(source.id);

  // Hooks for URL manipulation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isResolved = source.status === "RESOLVED";

  const handleDelete = () => {
    updateReport({ status: "RESOLVED", isDeleted: true });
  };

  const handleResolve = () => {
    updateReport({ status: "RESOLVED", isDeleted: false });
  };

  // Hàm xử lý khi bấm Xem chi tiết -> Đẩy lên URL
  const handleViewDetail = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", source.id);
    params.set("open", "true");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-end gap-2 pr-2">
      <Button
        variant="outline"
        onClick={handleViewDetail}
        className="h-9 w-9 rounded-full border-0 bg-blue-50 p-0 text-blue-500 shadow-sm transition-all hover:scale-110 hover:bg-blue-100 hover:text-blue-600"
        title="Xem chi tiết"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {isResolved ? (
        <Button
          variant="outline"
          disabled
          className="h-9 w-9 rounded-full border-0 bg-red-50/50 p-0 text-red-500/50"
          title="Xóa bình luận (đã xử lý)"
        >
          <Trash className="h-4 w-4" />
        </Button>
      ) : (
        <ConfirmationDialog
          title="Xác nhận xóa bình luận?"
          description="Hành động này sẽ ẩn bình luận khỏi hệ thống. Bạn có muốn tiếp tục không?"
          onConfirm={handleDelete}
          confirmText="Đồng ý"
          isDestructive={true}
        >
          <Button
            variant="outline"
            className="h-9 w-9 rounded-full border-0 bg-red-50 p-0 text-red-500 shadow-sm transition-all hover:scale-110 hover:bg-red-100 hover:text-red-600"
            title="Xóa bình luận"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmationDialog>
      )}

      {isResolved ? (
        <Button
          variant="outline"
          disabled
          className="h-9 w-9 rounded-full border-0 bg-emerald-50/50 p-0 text-emerald-500/50"
          title="Không vi phạm (đã xử lý)"
        >
          <Check className="h-4 w-4" />
        </Button>
      ) : (
        <ConfirmationDialog
          title="Xác nhận bình luận này không vi phạm?"
          description="Hành động này sẽ đánh dấu bình luận này là không vi phạm. Bạn có muốn tiếp tục không?"
          onConfirm={handleResolve}
          confirmText="Đồng ý"
        >
          <Button
            variant="outline"
            className="h-9 w-9 rounded-full border-0 bg-emerald-50 p-0 text-emerald-500 shadow-sm transition-all hover:scale-110 hover:bg-emerald-100 hover:text-emerald-600"
            title="Không vi phạm"
          >
            <Check className="h-4 w-4" />
          </Button>
        </ConfirmationDialog>
      )}
    </div>
  );
};

export const reportedCommentsColumns: ColumnDef<ReportCommentDetail>[] = [
  {
    accessorKey: "comment",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <TextInitial className="h-3.5 w-3.5 text-indigo-500" />
          Bình luận
        </div>
      );
    },
    cell: ({ row }) => {
      const fullReport = row.original;
      const comment = fullReport.comment;
      return (
        <div className="flex flex-col gap-1">
          <p
            className="max-w-[200px] truncate text-[14px] font-semibold text-slate-800 transition-colors hover:text-indigo-600 lg:max-w-[250px]"
            title={comment.content}
          >
            {comment.content}
          </p>
          <div className="flex flex-row items-center justify-start gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            <time className="text-[12px] font-medium text-slate-500">
              {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
            </time>
            <span className="text-[12px] font-medium text-slate-500">
              • {comment.user.fullName}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <TextInitial className="h-3.5 w-3.5 text-indigo-500" />
          Lý do
        </div>
      );
    },
    cell: ({ cell }) => {
      return (
        <div
          className="max-w-[200px] truncate text-[13px] font-medium text-red-500 lg:max-w-[250px]"
          title={cell.getValue() as string}
        >
          {cell.getValue() as string}
        </div>
      );
    },
  },
  {
    accessorKey: "reportedBy",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-indigo-500" />
          Người báo cáo
        </div>
      );
    },
    cell: ({ row }) => {
      const fullReport = row.original;
      const reporter = fullReport.reportedBy;
      return (
        <div
          className="max-w-[200px] truncate text-[13px] font-medium text-slate-700 lg:max-w-[250px]"
          title={reporter.fullName}
        >
          {reporter.fullName}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-indigo-500" />
          Trạng thái
        </div>
      );
    },
    cell: ({ cell }) => {
      return (
        <div className="capitalize">
          <StatusBadge
            type={cell.getValue() as "PENDING" | "RESOLVED" | "REJECTED"}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-4 h-8 text-xs font-semibold tracking-wider text-slate-500 uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <CalendarClock className="mr-2 h-3.5 w-3.5 text-indigo-500" />
          Ngày tạo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const createdAt = cell.getValue() as string;
      return (
        <time className="text-sm font-medium text-slate-500">
          {new Date(createdAt).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
