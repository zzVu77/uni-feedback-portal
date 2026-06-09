/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import ConfirmationDialog from "@/components/common/ConfirmationDialog"; // Ensure correct import path
import { Button } from "@/components/ui/button";
import { useDeleteAnnouncementById } from "@/hooks/queries/useAnnouncementQueries";
import { AnnouncementManagementItem } from "@/types";
import { stripHtml } from "@/utils/stripHtml";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarClock,
  Eye,
  FileText,
  Loader2,
  SquarePen,
  TextInitial,
  Trash,
  User,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const ActionCell = ({ row }: { row: any }) => {
  const { user } = useUser();
  const announcement = row.original;
  const { mutateAsync: deleteAnnouncement, isPending: isDeleting } =
    useDeleteAnnouncementById();

  const handleDelete = async () => {
    await deleteAnnouncement(announcement.id);
  };

  return (
    <div className="flex flex-row items-center justify-start gap-2">
      {/* Edit Button */}
      <Link
        href={
          user?.role === "STAFF_ASSISTANT"
            ? `/staff-assistant/announcement-management/edit/${announcement.id}`
            : `/staff/announcement-management/edit/${announcement.id}`
        }
      >
        <Button
          variant="outline"
          className="h-9 w-9 rounded-full border-0 bg-blue-50 p-0 text-blue-500 shadow-sm transition-all hover:scale-110 hover:bg-blue-100 hover:text-blue-600"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </Link>

      <Link href={`/forum/announcements/${announcement.id}`}>
        <Button
          variant="outline"
          className="h-9 w-9 rounded-full border-0 bg-slate-50 p-0 text-slate-500 shadow-sm transition-all hover:scale-110 hover:bg-slate-100 hover:text-slate-600"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </Link>

      {/* Delete Button with Confirmation */}
      <ConfirmationDialog
        title="Bạn có chắc chắn muốn xoá thông báo này?"
        description="Hành động này không thể hoàn tác. Thông báo sẽ bị xoá vĩnh viễn khỏi hệ thống."
        onConfirm={handleDelete}
        confirmText="Xoá"
        isDestructive={true}
      >
        <Button
          variant="outline"
          className="h-9 w-9 rounded-full border-0 bg-red-50 p-0 text-red-500 shadow-sm transition-all hover:scale-110 hover:bg-red-100 hover:text-red-600"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </ConfirmationDialog>
    </div>
  );
};

export const announcementManagementColumns: ColumnDef<AnnouncementManagementItem>[] =
  [
    {
      accessorKey: "title",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <TextInitial className="h-3 w-3" />
            Tiêu đề
          </div>
        );
      },
      cell: ({ row }) => (
        <div
          className="max-w-[250px] truncate font-semibold text-slate-800 capitalize transition-colors hover:text-indigo-600 lg:max-w-sm"
          title={row.getValue("title")}
        >
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "content",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            Nội dung
          </div>
        );
      },
      cell: ({ row }) => {
        const plainText = stripHtml(row.getValue("content"));

        return (
          <div
            className="max-w-[300px] truncate text-sm font-medium text-slate-600 lg:max-w-[400px]"
            title={plainText}
          >
            {plainText}
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: () => {
        return (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            Người đăng
          </div>
        );
      },
      cell: ({ row }) => (
        <div
          className="max-w-[150px] truncate font-medium text-slate-700"
          title={row.original.user?.userName}
        >
          {row.original.user?.userName || "N/A"}
        </div>
      ),
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
            <CalendarClock className="mr-2 h-3 w-3" />
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
      cell: ActionCell,
    },
  ];
