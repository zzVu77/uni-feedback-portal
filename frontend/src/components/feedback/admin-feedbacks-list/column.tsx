"use client";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { AdminFeedbackItem } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarClock,
  ChevronRight,
  LayoutDashboard,
  Loader,
  TextInitial,
  User,
} from "lucide-react";
import Link from "next/link";

export const adminFeedbackColumns: ColumnDef<AdminFeedbackItem>[] = [
  {
    accessorKey: "subject",
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
        title={row.getValue("subject")}
      >
        {row.getValue("subject")}
      </div>
    ),
  },
  {
    accessorKey: "category",
    accessorFn: (row) => row.category.name,
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-3 w-3" />
          Danh mục
        </div>
      );
    },
    cell: ({ cell }) => {
      const categoryName = cell.getValue() as string;
      return <div className="capitalize">{categoryName}</div>;
    },
  },
  // --- ĐÃ XÓA PHẦN KHAI BÁO CATEGORY BỊ LẶP Ở ĐÂY ---
  {
    accessorKey: "department",
    accessorFn: (row) => row.department.name,
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-3 w-3" />
          Phòng ban
        </div>
      );
    },
    cell: ({ cell }) => {
      const departmentName = cell.getValue() as string; // Sửa tên biến cho đúng ngữ cảnh
      return <div className="capitalize">{departmentName}</div>;
    },
  },
  {
    accessorKey: "currentStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Loader className="h-3 w-3" />
          Trạng thái
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("currentStatus");
      return (
        <div className="capitalize">
          <StatusBadge
            type={
              status as
                | "PENDING"
                | "IN_PROGRESS"
                | "RESOLVED"
                | "REJECTED"
                | "CLOSED"
            }
          />
        </div>
      );
    },
  },
  {
    accessorKey: "student",
    accessorFn: (row) => row.student?.fullName ?? "Ẩn danh",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <User className="h-3 w-3" />
          Người gửi
        </div>
      );
    },
    cell: ({ cell }) => {
      const studentName = cell.getValue() as string; // Sửa tên biến cho đúng ngữ cảnh
      return <div className="capitalize">{studentName}</div>;
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
          Ngày gửi
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
      const feedback = row.original;
      return (
        <Link href={`/admin/feedbacks-management/${feedback.id}`}>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-black/50 transition-all ease-in-out hover:scale-110 hover:bg-transparent hover:text-black/80"
          >
            <ChevronRight />
          </Button>
        </Link>
      );
    },
  },
];
