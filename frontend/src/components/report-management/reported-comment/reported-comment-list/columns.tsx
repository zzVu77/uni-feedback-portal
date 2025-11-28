"use client";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  CalendarClock,
  Check,
  Eye,
  MoreHorizontalIcon,
  Target,
  TextInitial,
  Trash,
  User,
} from "lucide-react";
import Link from "next/link";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { ReportCommentDetail } from "@/types";
import { useUpdateReportComment } from "@/hooks/queries/useReportCommentQueries";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-4 w-4 p-0">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <div
            onClick={(e) => {
              e.preventDefault();
              handleViewDetail();
            }}
            className="w-full cursor-pointer"
          >
            <Button className="h-auto w-full justify-start border-none bg-transparent p-0 font-normal text-blue-500 shadow-none hover:bg-transparent hover:text-blue-600">
              <Eye className="text-blue-primary-500 mr-2 h-4 w-4" />
              Xem chi tiết
            </Button>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem asChild disabled={isResolved}>
          <div
            onClick={(e) => {
              e.preventDefault();
              if (isResolved) return;
            }}
            className={cn(
              "w-full cursor-pointer text-red-500 hover:text-red-500",
              isResolved && "cursor-not-allowed opacity-50",
            )}
          >
            {isResolved ? (
              <Button
                disabled
                className="h-auto w-full justify-start border-none bg-transparent p-0 font-normal text-red-500 shadow-none hover:bg-transparent"
              >
                <Trash className="mr-2 h-4 w-4 hover:text-gray-400" />
                Xóa bình luận
              </Button>
            ) : (
              <ConfirmationDialog
                title="Xác nhận xóa bình luận?"
                description="Hành động này sẽ ẩn bình luận khỏi hệ thống. Bạn có muốn tiếp tục không?"
                onConfirm={handleDelete}
                confirmText="Đồng ý"
              >
                <Button className="h-auto w-full justify-start border-none bg-transparent p-0 font-normal text-red-500 shadow-none hover:bg-transparent">
                  <Trash className="mr-2 h-4 w-4 text-red-500 hover:text-gray-400" />
                  Xóa bình luận
                </Button>
              </ConfirmationDialog>
            )}
          </div>
        </DropdownMenuItem>

        {/* Không vi phạm */}
        <DropdownMenuItem asChild disabled={isResolved}>
          <div
            onClick={(e) => {
              e.preventDefault();
              if (isResolved) return;
            }}
            className={cn(
              "w-full cursor-pointer text-green-500 hover:text-green-500",
              isResolved && "cursor-not-allowed opacity-50",
            )}
          >
            {isResolved ? (
              <Button
                disabled
                className="h-auto w-full justify-start border-none bg-transparent p-0 font-normal text-green-500 shadow-none hover:bg-transparent"
              >
                <Check className="mr-2 h-4 w-4 text-green-400" />
                Không vi phạm
              </Button>
            ) : (
              <ConfirmationDialog
                title="Xác nhận bình luận này không vi phạm?"
                description="Hành động này sẽ đánh dấu bình luận này là không vi phạm. Bạn có muốn tiếp tục không?"
                onConfirm={handleResolve}
                confirmText="Đồng ý"
              >
                <Button className="h-auto w-full justify-start border-none bg-transparent p-0 font-normal text-green-500 shadow-none hover:bg-transparent">
                  <Check className="mr-2 h-4 w-4 text-green-400" />
                  Không vi phạm
                </Button>
              </ConfirmationDialog>
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const reportedCommentsColumns: ColumnDef<ReportCommentDetail>[] = [
  {
    accessorKey: "comment",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <TextInitial className="h-3 w-3" />
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
            className="text-blue-primary-500 max-w-[250px] truncate text-[13px] font-semibold capitalize lg:max-w-sm"
            title={comment.content}
          >
            {comment.content}
          </p>
          <div className="flex flex-row items-center justify-start gap-0.5">
            <Calendar className="h-3 w-3 text-gray-400/80" />
            <time className="text-[11px] text-gray-500/80 capitalize">
              {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
            </time>
            <span className="text-[11px] text-gray-500/80">
              - {comment.user.fullName}
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
          <TextInitial className="h-3 w-3" />
          Lý do
        </div>
      );
    },
    cell: ({ cell }) => {
      return (
        <div
          className="text-red-primary-400 max-w-[250px] truncate text-[13px] capitalize lg:max-w-sm"
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
          <User className="h-3 w-3" />
          Người báo cáo
        </div>
      );
    },
    cell: ({ row }) => {
      const fullReport = row.original;
      const reporter = fullReport.reportedBy;
      return (
        <div
          className="max-w-[250px] truncate text-[13px] capitalize lg:max-w-sm"
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
          <TextInitial className="h-3 w-3" />
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
    accessorKey: "post",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <Target className="h-3 w-3" />
          Nguồn
        </div>
      );
    },
    cell: ({ row }) => {
      const source = row.original;
      return (
        <Link
          href={
            source.target.targetType === "FORUM_POST"
              ? `/forum/posts/${source.target.targetInfo.id}`
              : `/forum//announcements/${source.target.targetInfo.id}`
          }
        >
          <span className="text-blue-primary-500 text-[13px] capitalize italic underline">
            {source.target.targetInfo.title}
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <CalendarClock className="h-3 w-3" />
          Ngày
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const createdAt = cell.getValue() as string;
      return (
        <time className="capitalize">
          {new Date(createdAt).toLocaleString("vi-VN")}
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
