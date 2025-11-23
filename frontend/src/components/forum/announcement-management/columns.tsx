"use client";
import { Button } from "@/components/ui/button";
import { AnnouncementManagementItem } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarClock,
  Eye,
  SquarePen,
  TextInitial,
  Trash,
} from "lucide-react";
import Link from "next/link";

export const dummyData: AnnouncementManagementItem[] = [
  {
    id: "1",
    title: "Library Extended Hours for Finals Week",
    createdAt: "2023-10-01T10:15:30Z",
  },
  {
    id: "2",
    title: "Campus WiFi Maintenance Schedule",
    createdAt: "2023-10-05T14:20:00Z",
  },
  {
    id: "3",
    title: "New Online Course Registration System Launch",
    createdAt: "2023-10-10T09:00:00Z",
  },
  {
    id: "4",
    title: "Suggestion for new cafeteria menu",
    createdAt: "2023-10-12T11:30:00Z",
  },
  {
    id: "5",
    title: "Complaint about classroom cleanliness",
    createdAt: "2023-10-15T08:45:00Z",
  },
  {
    id: "6",
    title: "Inquiry about scholarship opportunities",
    createdAt: "2023-10-18T16:00:00Z",
  },
  {
    id: "7",
    title: "Feedback on recent university event",
    createdAt: "2023-10-20T13:00:00Z",
  },
  {
    id: "8",
    title: "Cafeteria Menu Updates",
    createdAt: "2023-10-22T10:10:10Z",
  },
  {
    id: "9",
    title: "Suggestion for more bike racks on campus",
    createdAt: "2023-10-25T12:00:00Z",
  },
  {
    id: "10",
    title: "Question about graduation requirements",
    createdAt: "2023-10-28T15:25:00Z",
  },
  {
    id: "11",
    title: "Lost and found inquiry - lost my textbook",
    createdAt: "2023-11-01T17:00:00Z",
  },
  {
    id: "12",
    title: "Praise for a helpful professor",
    createdAt: "2023-11-03T11:00:00Z",
  },
  {
    id: "13",
    title: "Request to extend library hours during exams",
    createdAt: "2023-11-05T18:00:00Z",
  },
  {
    id: "14",
    title: "Issue with vending machine in the main hall",
    createdAt: "2023-11-07T09:30:00Z",
  },
];

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
      cell: ({ row }) => {
        const announcement = row.original;
        return (
          <div className="flex flex-row items-center justify-start gap-2">
            <Link
              href={`/staff/announcement-management/edit/${announcement.id}`}
            >
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
            <Link href={`/student/my-feedbacks/${announcement.id}`}>
              <Button
                variant="outline"
                className="h-8 w-8 bg-red-200/40 p-0 text-black/50 transition-all ease-in-out hover:scale-110 hover:bg-red-200/80 hover:text-black/80"
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];
