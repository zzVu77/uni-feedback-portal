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
import { Category } from "@/types/category";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  Dot,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Power,
  TextIcon,
} from "lucide-react";
import { useState } from "react";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { CategoryDialog } from "../CategoryDialog";
import { cn } from "@/lib/utils";

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
          <Button variant="ghost" className="h-8 w-8 p-0">
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <TextIcon className="mr-2 h-3 w-3" />
          Tên Danh Mục
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "feedbackCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
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
      return <div className="pl-20 font-bold">{count}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={
            isActive
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-500 hover:bg-red-200"
          }
        >
          {isActive ? <Dot className="animate-ping" /> : <Ban />}
          {isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
