"use client";

import { CreateUserDialog } from "@/components/admin/user-management/CreateUserDialog";
import { UserManagementTable } from "@/components/admin/user-management/UserManagementTable";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function UserManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Wrapper>
      <div className="flex h-full w-full flex-col gap-1">
        {/* Page Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Quản lý người dùng
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Quản lý danh sách sinh viên, nhân viên phòng ban, xem lịch sử vi
              phạm và phân quyền.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-indigo-600 shadow-md transition-all hover:bg-indigo-700 active:scale-95"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm người dùng mới
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <UserManagementTable />
        </div>
      </div>
      <CreateUserDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </Wrapper>
  );
}
