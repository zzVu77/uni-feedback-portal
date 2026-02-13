"use client";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { MyFeedbackHistoryItem } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Building2,
  CalendarClock,
  ChevronRight,
  LayoutDashboard,
  Loader,
  TextInitial,
} from "lucide-react";
import Link from "next/link";

export const dummyData: MyFeedbackHistoryItem[] = [
  {
    id: "1",
    subject:
      "Feedback on course materials Feedback on course materials Feedback on course materials Feedback on course materials Feedback on course materials Feedback on course materials Feedback on course materials Feedback on course materials Feedback on course materialsFeedback on course materials",
    category: { id: "1", name: "Technology" },
    currentStatus: "PENDING",
    createdAt: "2023-10-01T10:15:30Z",
    department: { id: "d1", name: "IT Department" },
  },
  {
    id: "2",
    subject: "Request for additional resources",
    category: { id: "2", name: "Library" },
    currentStatus: "IN_PROGRESS",
    createdAt: "2023-10-05T14:20:00Z",
    department: { id: "d2", name: "Library Department" },
  },
  {
    id: "3",
    subject: "Issue with campus Wi-Fi",
    category: { id: "1", name: "Technology" },
    currentStatus: "RESOLVED",
    createdAt: "2023-10-10T09:00:00Z",
    department: { id: "d1", name: "IT Department" },
  },
  {
    id: "4",
    subject: "Suggestion for new cafeteria menu",
    category: { id: "3", name: "Food Services" },
    currentStatus: "REJECTED",
    createdAt: "2023-10-12T11:30:00Z",
    department: { id: "d3", name: "Cafeteria" },
  },
  {
    id: "5",
    subject: "Complaint about classroom cleanliness",
    category: { id: "4", name: "Facilities" },
    currentStatus: "RESOLVED",
    createdAt: "2023-10-15T08:45:00Z",
    department: { id: "d4", name: "Facilities Management" },
  },
  {
    id: "6",
    subject: "Inquiry about scholarship opportunities",
    category: { id: "5", name: "Admissions" },
    currentStatus: "PENDING",
    createdAt: "2023-10-18T16:00:00Z",
    department: { id: "d5", name: "Admissions Office" },
  },
  {
    id: "7",
    subject: "Feedback on recent university event",
    category: { id: "6", name: "Events" },
    currentStatus: "RESOLVED",
    createdAt: "2023-10-20T13:00:00Z",
    department: { id: "d6", name: "Student Affairs" },
  },
  {
    id: "8",
    subject: "Problem with student portal login",
    category: { id: "1", name: "Technology" },
    currentStatus: "IN_PROGRESS",
    createdAt: "2023-10-22T10:10:10Z",
    department: { id: "d1", name: "IT Department" },
  },
  {
    id: "9",
    subject: "Suggestion for more bike racks on campus",
    category: { id: "4", name: "Facilities" },
    currentStatus: "PENDING",
    createdAt: "2023-10-25T12:00:00Z",
    department: { id: "d4", name: "Facilities Management" },
  },
  {
    id: "10",
    subject: "Question about graduation requirements",
    category: { id: "7", name: "Academics" },
    currentStatus: "RESOLVED",
    createdAt: "2023-10-28T15:25:00Z",
    department: { id: "d7", name: "Registrar's Office" },
  },
  {
    id: "11",
    subject: "Lost and found inquiry - lost my textbook",
    category: { id: "8", name: "Security" },
    currentStatus: "RESOLVED",
    createdAt: "2023-11-01T17:00:00Z",
    department: { id: "d8", name: "Campus Security" },
  },
  {
    id: "12",
    subject: "Praise for a helpful professor",
    category: { id: "7", name: "Academics" },
    currentStatus: "RESOLVED",
    createdAt: "2023-11-03T11:00:00Z",
    department: { id: "d9", name: "Academic Affairs" },
  },
  {
    id: "13",
    subject: "Request to extend library hours during exams",
    category: { id: "2", name: "Library" },
    currentStatus: "REJECTED",
    createdAt: "2023-11-05T18:00:00Z",
    department: { id: "d2", name: "Library Department" },
  },
  {
    id: "14",
    subject: "Issue with vending machine in the main hall",
    category: { id: "3", name: "Food Services" },
    currentStatus: "IN_PROGRESS",
    createdAt: "2023-11-07T09:30:00Z",
    department: { id: "d3", name: "Cafeteria" },
  },
];

export const myFeedbacksHistoryColumns: ColumnDef<MyFeedbackHistoryItem>[] = [
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
        className="max-w-[250px] truncate font-medium text-slate-900 capitalize lg:max-w-sm"
        title={row.getValue("subject")}
      >
        {row.getValue("subject")}
      </div>
    ),
  },
  {
    accessorKey: "department",
    accessorFn: (row) => row.department.name,
    header: () => {
      return (
        <div className="flex items-center gap-2">
          <Building2 className="h-3 w-3" />
          Phòng ban tiếp nhận
        </div>
      );
    },
    cell: ({ cell }) => {
      const departmentName = cell.getValue() as string;
      return (
        <div className="text-sm text-slate-500 capitalize">
          {departmentName}
        </div>
      );
    },
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
        <div className="text-sm text-slate-600 capitalize">{categoryName}</div>
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
        <time className="text-sm text-slate-500 capitalize">
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
        <Link href={`/student/my-feedbacks/${feedback.id}`}>
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
