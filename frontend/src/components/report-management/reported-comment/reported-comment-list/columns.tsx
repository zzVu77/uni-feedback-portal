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
import { ReportedComment } from "@/types";
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

export const dummyData: ReportedComment[] = [
  {
    id: "1",
    reason: "This is a spam comment.",
    status: "PENDING",
    adminResponse: null,
    createdAt: "2025-10-20T10:00:00Z",
    reportedBy: {
      id: "user-1",
      fullName: "John Doe",
    },
    comment: {
      id: "comment-1",
      content: "This is a great post!",
      createdAt: "2025-10-20T09:00:00Z",
      deletedAt: null,
      user: {
        id: "user-2",
        fullName: "Jane Smith",
      },
    },
    post: {
      id: "post-1",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the first post.",
    },
  },
  {
    id: "2",
    reason: "Inappropriate language.",
    status: "RESOLVED",
    adminResponse: "The comment has been removed.",
    createdAt: "2025-10-21T11:00:00Z",
    reportedBy: {
      id: "user-3",
      fullName: "Peter Jones",
    },
    comment: {
      id: "comment-2",
      content: "This is some bad language.",
      createdAt: "2025-10-21T10:30:00Z",
      deletedAt: "2025-10-21T11:05:00Z",
      user: {
        id: "user-4",
        fullName: "Mary Williams",
      },
    },
    post: {
      id: "post-2",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the second post.",
    },
  },
  {
    id: "3",
    reason: "Hate speech.",
    status: "REJECTED",
    adminResponse: "This comment does not violate our community guidelines.",
    createdAt: "2025-10-22T12:00:00Z",
    reportedBy: {
      id: "user-5",
      fullName: "David Brown",
    },
    comment: {
      id: "comment-3",
      content: "I disagree with this post.",
      createdAt: "2025-10-22T11:45:00Z",
      deletedAt: null,
      user: {
        id: "user-6",
        fullName: "Susan Davis",
      },
    },
    post: {
      id: "post-3",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the third post.",
    },
  },
  {
    id: "4",
    reason: "Misinformation.",
    status: "PENDING",
    adminResponse: null,
    createdAt: "2025-10-23T13:00:00Z",
    reportedBy: {
      id: "user-7",
      fullName: "Michael Miller",
    },
    comment: {
      id: "comment-4",
      content: "This is not true.",
      createdAt: "2025-10-23T12:50:00Z",
      deletedAt: null,
      user: {
        id: "user-8",
        fullName: "Linda Wilson",
      },
    },
    post: {
      id: "post-4",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the fourth post.",
    },
  },
  {
    id: "5",
    reason: "Self-promotion.",
    status: "RESOLVED",
    adminResponse: "Comment removed.",
    createdAt: "2025-10-24T14:00:00Z",
    reportedBy: {
      id: "user-9",
      fullName: "Robert Moore",
    },
    comment: {
      id: "comment-5",
      content: "Check out my website!",
      createdAt: "2025-10-24T13:30:00Z",
      deletedAt: "2025-10-24T14:02:00Z",
      user: {
        id: "user-10",
        fullName: "Patricia Taylor",
      },
    },
    post: {
      id: "post-5",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the fifth post.",
    },
  },
  {
    id: "6",
    reason: "Harassment.",
    status: "PENDING",
    adminResponse: null,
    createdAt: "2025-10-25T15:00:00Z",
    reportedBy: {
      id: "user-11",
      fullName: "Charles Anderson",
    },
    comment: {
      id: "comment-6",
      content: "You are wrong!",
      createdAt: "2025-10-25T14:55:00Z",
      deletedAt: null,
      user: {
        id: "user-12",
        fullName: "Barbara Thomas",
      },
    },
    post: {
      id: "post-6",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the sixth post.",
    },
  },
  {
    id: "7",
    reason: "Off-topic.",
    status: "REJECTED",
    adminResponse: "The comment is relevant to the discussion.",
    createdAt: "2025-10-26T16:00:00Z",
    reportedBy: {
      id: "user-13",
      fullName: "James Jackson",
    },
    comment: {
      id: "comment-7",
      content: "I like turtles.",
      createdAt: "2025-10-26T15:45:00Z",
      deletedAt: null,
      user: {
        id: "user-14",
        fullName: "Jennifer White",
      },
    },
    post: {
      id: "post-7",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the seventh post.",
    },
  },
  {
    id: "8",
    reason: "Spam.",
    status: "PENDING",
    adminResponse: null,
    createdAt: "2025-10-27T17:00:00Z",
    reportedBy: {
      id: "user-15",
      fullName: "William Harris",
    },
    comment: {
      id: "comment-8",
      content: "Buy now!",
      createdAt: "2025-10-27T16:30:00Z",
      deletedAt: null,
      user: {
        id: "user-16",
        fullName: "Elizabeth Martin",
      },
    },
    post: {
      id: "post-8",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the eighth post.",
    },
  },
  {
    id: "9",
    reason: "Inappropriate content.",
    status: "RESOLVED",
    adminResponse: "The comment has been deleted.",
    createdAt: "2025-10-28T18:00:00Z",
    reportedBy: {
      id: "user-17",
      fullName: "Richard Thompson",
    },
    comment: {
      id: "comment-9",
      content: "This is not appropriate.",
      createdAt: "2025-10-28T17:50:00Z",
      deletedAt: "2025-10-28T18:01:00Z",
      user: {
        id: "user-18",
        fullName: "Maria Garcia",
      },
    },
    post: {
      id: "post-9",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the ninth post.",
    },
  },
  {
    id: "10",
    reason: "Just a test report.",
    status: "PENDING",
    adminResponse: null,
    createdAt: "2025-10-29T19:00:00Z",
    reportedBy: {
      id: "user-19",
      fullName: "Joseph Martinez",
    },
    comment: {
      id: "comment-10",
      content: "Testing the report functionality.",
      createdAt: "2025-10-29T18:45:00Z",
      deletedAt: null,
      user: {
        id: "user-20",
        fullName: "Nancy Robinson",
      },
    },
    post: {
      id: "post-10",
      subject: "Extended Library Hours During Finals Week",
      description: "This is the description of the tenth post.",
    },
  },
];

export const reportedCommentsColumns: ColumnDef<ReportedComment>[] = [
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
        <Link href={`/forum/posts/${source.post.id}`}>
          <span className="text-blue-primary-500 text-[13px] capitalize italic underline">
            {source.post.subject}
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
