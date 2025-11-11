"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarClock,
  Edit,
  MoreHorizontal,
  TextIcon,
  Trash,
} from "lucide-react";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { CategoryDialog } from "../CategoryDialog";

// 1. Định nghĩa Type cho Category
export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

// 2. Dữ liệu mẫu (Dummy Data)
export const dummyCategoryData: Category[] = [
  {
    id: "CAT-001",
    name: "Technology",
    createdAt: "2023-10-01T10:15:30Z",
  },
  {
    id: "CAT-002",
    name: "Library",
    createdAt: "2023-10-02T11:20:00Z",
  },
  {
    id: "CAT-003",
    name: "Food Services",
    createdAt: "2023-10-03T09:00:00Z",
  },
  {
    id: "CAT-004",
    name: "Facilities",
    createdAt: "2023-10-04T14:30:00Z",
  },
  {
    id: "CAT-005",
    name: "Academics",
    createdAt: "2023-10-05T08:45:00Z",
  },
];

// 3. Định nghĩa Cột (Columns Definition)
export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <TextIcon className="h-3 w-3" />
          Tên Danh Mục
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <CalendarClock className="mr-2 h-3 w-3" />
          Ngày Tạo
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
      const category = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                Hành động
              </DropdownMenuLabel>
              <CategoryDialog
                initialData={category}
                mode="edit"
                onSubmit={() => Promise.resolve()}
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer text-green-500"
                >
                  <Edit className="h-4 w-4 text-green-500" />
                  <span>Chỉnh sửa</span>
                </DropdownMenuItem>
              </CategoryDialog>
              <ConfirmationDialog
                title="Xác nhận xóa danh mục?"
                description="Hành động này sẽ ẩn danh mục khỏi hệ thống. Bạn có muốn tiếp tục không?"
                onConfirm={() => {}}
                confirmText="Đồng ý"
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer text-red-500 hover:text-red-500"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                  <span>Xóa</span>
                </DropdownMenuItem>
              </ConfirmationDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
