"use client";
import { UpdateUserDialog } from "@/components/admin/user-management/UpdateUserDialog";
import { UpdateUserStatusDialog } from "@/components/admin/user-management/UpdateUserStatusDialog";
import {
  getRoleInfo,
  getStatusInfo,
} from "@/components/admin/user-management/UserManagementTable";
import { UserViolationsTable } from "@/components/admin/user-management/UserViolationsTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetUserById } from "@/hooks/queries/useUserManagementQueries";
import { cn } from "@/lib/utils";
import { UserStatus } from "@/types/user-management";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Lock,
  Mail,
  Shield,
  Unlock,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useIsClient } from "@/hooks/useIsClient";

export default function UserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const { data: user, isLoading } = useGetUserById(id, {
    enabled: isClient,
  });

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center font-medium text-slate-500">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <Shield className="mb-4 h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800">
          Không tìm thấy người dùng
        </h2>
        <Link href="/admin/user-management">
          <Button variant="link" className="mt-4 text-indigo-600">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  const roleInfo = getRoleInfo(user.role);
  const statusInfo = getStatusInfo(user.status);

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/user-management">
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hồ sơ người dùng
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Xem chi tiết thông tin và lịch sử hệ thống của người dùng.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info Card */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col items-center bg-slate-50/50 p-8 text-center">
              <Avatar className="mb-4 h-24 w-24 shadow-md ring-4 ring-white">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-indigo-100 text-3xl font-bold text-indigo-700">
                  {user.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-slate-900">
                {user.fullName}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md border px-3 py-1 font-medium",
                    roleInfo.color,
                  )}
                >
                  {roleInfo.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md border px-3 py-1 font-medium",
                    statusInfo.color,
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </Badge>
              </div>

              {user.status === UserStatus.DEACTIVATED &&
                user.deactivatedUntil && (
                  <div className="mt-3 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                    Bị khóa đến:{" "}
                    {format(
                      new Date(user.deactivatedUntil),
                      "dd/MM/yyyy HH:mm",
                    )}
                  </div>
                )}
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Phòng ban trực thuộc
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {user.department?.name || "Không thuộc phòng ban nào"}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Ngày tham gia
                  </h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {format(new Date(user.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-slate-100 bg-slate-100">
              <Button
                variant="ghost"
                className="rounded-none bg-white py-6 hover:bg-slate-50 hover:text-indigo-600"
                onClick={() => setIsUpdateOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" /> Cập nhật
              </Button>
              {user.status === UserStatus.ACTIVE ? (
                <Button
                  variant="ghost"
                  className="rounded-none bg-white py-6 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                  onClick={() => setIsStatusOpen(true)}
                >
                  <Lock className="mr-2 h-4 w-4" /> Khóa tài khoản
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="rounded-none bg-white py-6 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => setIsStatusOpen(true)}
                >
                  <Unlock className="mr-2 h-4 w-4" /> Mở khóa
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Violations Table */}
        <div className="col-span-1 lg:col-span-2">
          <UserViolationsTable userId={user.id} />
        </div>
      </div>

      <UpdateUserDialog
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        user={user}
      />

      <UpdateUserStatusDialog
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        userId={user.id}
        currentStatus={user.status}
      />
    </div>
  );
}
