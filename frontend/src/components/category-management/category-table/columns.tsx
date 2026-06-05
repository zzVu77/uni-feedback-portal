"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useUpdateCategoryName,
  useUpdateCategoryStatus,
} from "@/hooks/queries/useCategoryQueries";
import { cn } from "@/lib/utils";
import { Category } from "@/types/category";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Power,
  TextIcon,
} from "lucide-react";
import { useState } from "react";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { CategoryDialog } from "../CategoryDialog";

// --- Action Cell Component ---
// Separate component to handle mutations and dialog state for each row
const ActionCell = ({ row }: { row: Row<Category> }) => {
  const category = row.original;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hooks for mutations
  const { mutateAsync: updateName } = useUpdateCategoryName(category.id);
  const { mutate: updateStatus } = useUpdateCategoryStatus(category.id);

  const handleToggleStatus = () => {
    // Toggle logic: if true -> false, if false -> true
    updateStatus({ isActive: !category.isActive });
  };

  const handleUpdateName = async (values: { name: string }) => {
    await updateName({ name: values.name });
  };

  return (
    <div className="text-right">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 rounded-full bg-white p-0 text-slate-400 shadow-sm ring-1 ring-slate-200 transition-all hover:scale-110 hover:bg-indigo-50 hover:text-indigo-600 hover:ring-indigo-300"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-normal">
            Hành động
          </DropdownMenuLabel>

          {/* Edit Dialog Wrapper */}
          <CategoryDialog
            mode="edit"
            initialData={category}
            onSubmit={handleUpdateName}
          >
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing immediately
              className="cursor-pointer text-blue-600 focus:text-blue-600"
            >
              <Button className="h-auto w-full justify-start border-none bg-transparent p-0 font-normal text-blue-500 shadow-none hover:bg-transparent">
                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                <span>Chỉnh sửa tên</span>
              </Button>
            </DropdownMenuItem>
          </CategoryDialog>

          {/* Toggle Status Dialog Wrapper */}
          <ConfirmationDialog
            title={
              category.isActive
                ? "Vô hiệu hóa danh mục?"
                : "Kích hoạt danh mục?"
            }
            description={
              category.isActive
                ? "Danh mục này sẽ không còn hiển thị cho người dùng lựa chọn. Bạn có chắc chắn không?"
                : "Danh mục này sẽ hiển thị trở lại cho người dùng. Bạn có chắc chắn không?"
            }
            onConfirm={handleToggleStatus}
            confirmText="Đồng ý"
          >
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className={`cursor-pointer bg-white hover:bg-white ${
                category.isActive
                  ? "text-red-500 focus:text-red-500"
                  : "text-green-500 focus:text-green-500"
              }`}
            >
              <Button className="h-auto w-full justify-start border-none bg-transparent p-0 font-normal text-red-500 shadow-none hover:bg-transparent">
                <Power
                  className={cn(
                    "mr-2 h-4 w-4",
                    category.isActive ? "text-red-500" : "text-green-500",
                  )}
                />
                <span
                  className={cn(
                    category.isActive ? "text-red-500" : "text-green-500",
                  )}
                >
                  {category.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                </span>
              </Button>
            </DropdownMenuItem>
          </ConfirmationDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// --- Columns Definition ---
export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-4 h-8 text-xs font-semibold tracking-wider text-slate-500 uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <TextIcon className="mr-2 h-3 w-3" />
          Tên Danh Mục
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-semibold text-slate-800 capitalize transition-colors hover:text-indigo-600">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "feedbackCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-center text-xs font-semibold tracking-wider text-slate-500 uppercase hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <MessageCircle className="mr-2 h-3 w-3" />
          Số lượng phản hồi
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.original.feedbackCount ?? 0;
      return (
        <div className="flex w-full justify-center">
          <div className="flex w-14 items-center justify-center rounded-lg bg-indigo-50/80 py-1 font-bold text-indigo-600 shadow-sm">
            {count}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => (
      <div className="text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">
        Trạng thái
      </div>
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <div className="flex w-full justify-center">
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={cn(
              "rounded-full px-3 py-1 font-medium shadow-none transition-colors",
              isActive
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-600 hover:bg-red-200",
            )}
          >
            {isActive ? (
              <div className="mr-1.5 flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-600"></span>
              </div>
            ) : (
              <Ban className="mr-1.5 h-3 w-3" />
            )}
            {isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
          </Badge>
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
