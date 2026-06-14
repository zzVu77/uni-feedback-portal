"use client";

import { CreateKeywordDialog } from "@/components/admin/keywords-management/CreateKeywordDialog";
import { KeywordsManagementTable } from "@/components/admin/keywords-management/KeywordsManagementTable";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function KeywordsManagementPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Wrapper>
      <div className="flex h-full w-full flex-col gap-1">
        {/* Page Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between lg:items-center">
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Quản lý từ khóa cấm
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Thêm, sửa, xóa các từ khóa vi phạm (toxic keywords) trên hệ thống.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-indigo-600 shadow-md transition-all hover:bg-indigo-700 active:scale-95"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm từ khóa mới
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <KeywordsManagementTable />
        </div>
      </div>
      <CreateKeywordDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </Wrapper>
  );
}
