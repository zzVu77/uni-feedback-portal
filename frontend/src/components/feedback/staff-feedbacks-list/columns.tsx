"use client";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { StaffFeedbackItem } from "@/types";
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
import { usePathname } from "next/navigation";

const TitleLink = ({ id, subject }: { id: string; subject: string }) => {
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/staff-assistant")
    ? "/staff-assistant"
    : "/staff";
  return (
    <Link href={`${basePath}/list-feedbacks/${id}`}>
      <div
        className="max-w-[250px] truncate font-semibold text-slate-800 capitalize transition-colors hover:text-indigo-600 lg:max-w-sm"
        title={subject}
      >
        {subject}
      </div>
    </Link>
  );
};

const ActionLink = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/staff-assistant")
    ? "/staff-assistant"
    : "/staff";
  return (
    <Link href={`${basePath}/list-feedbacks/${id}`}>
      <Button
        variant="ghost"
        className="h-9 w-9 rounded-full bg-white p-0 text-slate-400 shadow-sm ring-1 ring-slate-200 transition-all hover:scale-110 hover:bg-indigo-50 hover:text-indigo-600 hover:ring-indigo-300"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </Link>
  );
};

export const staffFeedbackColumns: ColumnDef<StaffFeedbackItem>[] = [
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
      <TitleLink id={row.original.id} subject={row.getValue("subject")} />
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
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <span className="text-sm font-medium text-slate-600 capitalize">
            {categoryName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "currentStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-4 h-8 text-xs font-semibold tracking-wider text-slate-500 uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Loader className="mr-2 h-3 w-3" />
          Trạng thái
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("currentStatus");
      const isForwarded = row.original.isForwarding;
      return (
        <>
          <div className="flex flex-row items-center justify-start gap-1 capitalize">
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
            {isForwarded && <StatusBadge type="FORWARDED" />}
          </div>
        </>
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
      const studentName = cell.getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 capitalize">
            {studentName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    accessorFn: (row) => row.assignee?.fullName ?? "",
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <User className="h-3 w-3" />
          Người xử lý
        </div>
      );
    },
    cell: ({ cell }) => {
      const assigneeName = cell.getValue() as string;
      if (!assigneeName) {
        return (
          <span className="text-sm text-slate-400 italic">Chưa phân công</span>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-500">
            {assigneeName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 capitalize">
            {assigneeName}
          </span>
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
          <CalendarClock className="mr-2 h-3 w-3" />
          Ngày gửi
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
    cell: ({ row }) => {
      const feedback = row.original;
      return <ActionLink id={feedback.id} />;
    },
  },
];
