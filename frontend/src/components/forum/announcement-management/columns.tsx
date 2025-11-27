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
} from "lucide-react";
import Link from "next/link";

const ActionCell = ({ row }: { row: any }) => {
  const announcement = row.original;
  const { mutateAsync: deleteAnnouncement, isPending: isDeleting } =
    useDeleteAnnouncementById();

  const handleDelete = async () => {
    await deleteAnnouncement(announcement.id);
  };

  return (
    <div className="flex flex-row items-center justify-start gap-2">
      {/* Edit Button */}
      <Link href={`/staff/announcement-management/edit/${announcement.id}`}>
        <Button
          variant="outline"
          className="h-8 w-8 bg-blue-200/40 p-0 text-black/50 transition-all ease-in-out hover:scale-110 hover:bg-blue-200/80 hover:text-black/80"
        >
          <SquarePen className="h-4 w-4 text-blue-500" />
        </Button>
      </Link>

      <Link href={`/forum/announcements/${announcement.id}`}>
        <Button
          variant="outline"
          className="h-8 w-8 bg-gray-200/40 p-0 text-black/50 transition-all ease-in-out hover:scale-110 hover:bg-gray-200/80 hover:text-black/80"
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
      >
        <Button
          variant="outline"
          className="h-8 w-8 bg-red-200/40 p-0 text-black/50 transition-all ease-in-out hover:scale-110 hover:bg-red-200/80 hover:text-black/80"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
          ) : (
            <Trash className="h-4 w-4 text-red-500" />
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
          className="max-w-[250px] truncate capitalize lg:max-w-sm"
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
            className="max-w-[300px] truncate text-gray-500 lg:max-w-[400px]"
            title={plainText}
          >
            {plainText}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <CalendarClock className="h-3 w-3" />
            Ngày tạo
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
      cell: ActionCell,
    },
  ];
