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
import { ColumnDef } from "@tanstack/react-table";
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
import ReportCommentDetailDialog from "../ReportCommentDetailDialog";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { ReportCommentDetail } from "@/types";

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
    cell: ({ row }) => {
      const source = row.original;
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
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
              }}
              className="text-red-500 hover:text-red-500"
            >
              <ReportCommentDetailDialog data={source}>
                <Button className="border-none bg-transparent text-blue-500 shadow-none hover:bg-transparent">
                  <Eye className="text-blue-primary-500" />
                  Xem chi tiết
                </Button>
              </ReportCommentDetailDialog>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
              }}
              className="text-red-500 hover:text-red-500"
            >
              <ConfirmationDialog
                title="Xác nhận xóa bình luận?"
                description="Hành động này sẽ ẩn bình luận khỏi hệ thống. Bạn có muốn tiếp tục không?"
                onConfirm={() => {}}
                confirmText="Đồng ý"
              >
                <Button className="border-none bg-transparent text-red-500 shadow-none hover:bg-transparent">
                  <Trash className="text-red-500 hover:text-gray-400" />
                  Xóa bình luận
                </Button>
              </ConfirmationDialog>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
              }}
              className="text-red-500 hover:text-red-500"
            >
              <ConfirmationDialog
                title="Xác nhận bình luận này không vi phạm?"
                description="Hành động này sẽ đánh dấu bình luận này là không vi phạm. Bạn có muốn tiếp tục không?"
                onConfirm={() => {}}
                confirmText="Đồng ý"
              >
                <Button className="border-none bg-transparent text-green-500 shadow-none hover:bg-transparent">
                  <Check className="text-green-400" />
                  Không vi phạm
                </Button>
              </ConfirmationDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
