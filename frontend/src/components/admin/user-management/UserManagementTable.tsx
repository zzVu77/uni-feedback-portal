"use client";

import CommonFilter from "@/components/common/CommonFilter";
import { Loading } from "@/components/common/Loading";
import SearchBar from "@/components/common/SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagementFilters } from "@/hooks/filters/useUserManagementFilters";
import { useGetUsers } from "@/hooks/queries/useUserManagementQueries";
import { cn } from "@/lib/utils";
import {
  UserManagementFilter,
  UserRole,
  UserStatus,
} from "@/types/user-management";
import { format } from "date-fns";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FilterX,
  ListFilter,
  Lock,
  MoreHorizontal,
  SearchX,
  Trash2,
  Unlock,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { UpdateUserDialog } from "./UpdateUserDialog";
import { UpdateUserStatusDialog } from "./UpdateUserStatusDialog";
import { UserResponse } from "@/types/user-management";

export const getRoleInfo = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.SUPERADMIN:
      return {
        label: "Quản trị viên",
        color: "bg-red-100 text-red-700 border-red-200",
      };
    case UserRole.DEPARTMENT_STAFF:
      return {
        label: "Nhân viên phòng ban",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      };
    case UserRole.STAFF_ASSISTANT:
      return {
        label: "Cộng tác viên",
        color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      };
    case UserRole.STUDENT:
      return {
        label: "Sinh viên",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      };
    default:
      return {
        label: role,
        color: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
};

export const getStatusInfo = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return {
        label: "Hoạt động",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
      };
    case UserStatus.DEACTIVATED:
      return {
        label: "Đã khóa",
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: <Lock className="mr-1 h-3 w-3" />,
      };
    case UserStatus.BANNED:
      return {
        label: "Cấm",
        color: "bg-rose-100 text-rose-700 border-rose-200",
        icon: <Ban className="mr-1 h-3 w-3" />,
      };
    case UserStatus.PERMANENTLY_DELETED:
      return {
        label: "Đã xóa",
        color: "bg-slate-100 text-slate-700 border-slate-200",
        icon: <Trash2 className="mr-1 h-3 w-3" />,
      };
    default:
      return {
        label: status,
        color: "bg-slate-100 text-slate-700 border-slate-200",
        icon: null,
      };
  }
};

export const UserManagementTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "student";
  const filters = useUserManagementFilters();

  // Merge the base filter with the specific tab logic
  const queryFilter: UserManagementFilter = { ...filters };

  if (currentTab === "student") {
    // Only fetch students
    queryFilter.role = UserRole.STUDENT;
  } else if (currentTab === "staff") {
    // If no specific role is selected in the UI, fetch both
    if (!filters.role) {
      queryFilter.role = [UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT];
    }
  }

  const { data, isLoading, isFetching } = useGetUsers(queryFilter);

  const [selectedUserForStatus, setSelectedUserForStatus] = useState<{
    id: string;
    currentStatus: UserStatus;
  } | null>(null);

  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<UserResponse | null>(null);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (val: string) => {
    // Reset filters when switching tab
    const params = new URLSearchParams();
    params.set("tab", val);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const users = data?.results || [];
  const total = data?.total || 0;
  const pageCount = Math.ceil(total / (filters.limit || 10));

  const staffRoleOptions = [
    { label: "Tất cả vai trò", value: "all" },
    { label: "Nhân viên phòng ban", value: "DEPARTMENT_STAFF" },
    { label: "Cộng tác viên", value: "STAFF_ASSISTANT" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="flex w-full flex-shrink-0 flex-col gap-2"
      >
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-xl bg-slate-100/80 p-1">
            <TabsTrigger
              value="student"
              className="cursor-pointer rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Sinh viên
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="cursor-pointer rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Nhân sự phòng ban
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={currentTab} className="mt-0">
          <div className="flex w-full flex-shrink-0 items-center gap-3">
            <React.Suspense fallback={null}>
              <SearchBar
                placeholder="Tìm kiếm theo tên, email..."
                className="flex-1 bg-white shadow-sm"
              />
            </React.Suspense>

            {/* Desktop Filters */}
            <div className="hidden items-center gap-3 md:flex">
              {currentTab === "staff" && <CommonFilter.DepartmentSelection />}
              {currentTab === "staff" && (
                <CommonFilter.UserRoleSelection options={staffRoleOptions} />
              )}
              <CommonFilter.UserStatusSelection />

              <Button
                variant="outline"
                className="h-10 gap-2 rounded-lg border bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("tab", currentTab);
                  router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
              >
                <FilterX className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>

            {/* Mobile Filter Drawer */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full border-slate-200 bg-white/80 font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50"
                  >
                    <ListFilter className="h-4 w-4" />
                    Bộ lọc
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-xl px-6 pb-8">
                  <SheetHeader className="px-0 text-left">
                    <SheetTitle className="text-lg font-bold text-slate-800">
                      Bộ lọc tìm kiếm
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 py-4">
                    {currentTab === "staff" && (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <span className="ml-1 text-sm font-medium text-slate-700">
                            Phòng ban
                          </span>
                          <div className="w-full [&>button]:w-full">
                            <CommonFilter.DepartmentSelection />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="ml-1 text-sm font-medium text-slate-700">
                            Phân quyền
                          </span>
                          <div className="w-full [&>button]:w-full">
                            <CommonFilter.UserRoleSelection
                              options={staffRoleOptions}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <span className="ml-1 text-sm font-medium text-slate-700">
                        Trạng thái
                      </span>
                      <div className="w-full [&>button]:w-full">
                        <CommonFilter.UserStatusSelection />
                      </div>
                    </div>
                  </div>
                  <SheetFooter className="flex-row items-center gap-3 px-0 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 rounded-xl bg-red-400 text-white hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set("tab", currentTab);
                        router.replace(`${pathname}?${params.toString()}`, {
                          scroll: false,
                        });
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                    <SheetClose asChild>
                      <Button className="h-10 flex-[2] bg-indigo-600 hover:bg-indigo-700">
                        Xem kết quả
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-[20px] border border-slate-100 bg-white/50 shadow-sm">
        <Table className={cn("w-full", users.length === 0 && "h-full")}>
          <TableHeader className="sticky top-0 z-10 bg-indigo-50/80 backdrop-blur-md">
            <TableRow className="border-b border-indigo-100/50 hover:bg-transparent">
              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Người dùng
              </TableHead>
              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Phân quyền
              </TableHead>
              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Trạng thái
              </TableHead>

              {currentTab === "student" && (
                <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                  Vi phạm
                </TableHead>
              )}

              <TableHead className="h-14 px-3 text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Ngày tham gia
              </TableHead>
              <TableHead className="h-14 px-3 text-right text-xs font-bold tracking-wider text-indigo-800/70 uppercase lg:px-5">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell
                  colSpan={currentTab === "student" ? 6 : 5}
                  className="h-48 text-center"
                >
                  <Loading variant="spinner" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={currentTab === "student" ? 6 : 5}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <SearchX className="h-8 w-8 text-slate-300" />
                    <span>Không có dữ liệu để hiển thị</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                const statusInfo = getStatusInfo(user.status);

                return (
                  <TableRow
                    key={user.id}
                    className="group border-b border-slate-100 bg-white/40 transition-all hover:bg-indigo-50/30"
                  >
                    <TableCell className="px-3 py-4 lg:px-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 shadow-sm ring-2 ring-white">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback className="bg-indigo-100 font-bold text-indigo-700">
                            {user.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-700">
                            {user.fullName}
                          </span>
                          <span className="text-xs text-slate-500">
                            {user.email}
                          </span>
                          {user.department && (
                            <span className="mt-0.5 text-xs font-medium text-indigo-500">
                              {user.department.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-3 py-4 lg:px-5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-md border px-2.5 py-0.5 font-medium",
                          roleInfo.color,
                        )}
                      >
                        {roleInfo.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-3 py-4 lg:px-5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-md border px-2.5 py-0.5 font-medium",
                          statusInfo.color,
                        )}
                      >
                        <span className="flex items-center">
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </Badge>
                      {user.status === UserStatus.DEACTIVATED &&
                        user.deactivatedUntil && (
                          <div className="mt-1 text-[10px] font-medium text-amber-600">
                            Đến{" "}
                            {format(
                              new Date(user.deactivatedUntil),
                              "dd/MM/yyyy HH:mm",
                            )}
                          </div>
                        )}
                    </TableCell>

                    {currentTab === "student" && (
                      <TableCell className="px-3 py-4 lg:px-5">
                        {user.violationCount !== undefined &&
                        user.violationCount > 0 ? (
                          <div className="flex items-center gap-1.5 font-bold text-rose-600">
                            <AlertCircle className="h-4 w-4" />
                            <span>{user.violationCount} lần</span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-slate-400">
                            Không có
                          </span>
                        )}
                      </TableCell>
                    )}

                    <TableCell className="px-3 py-4 lg:px-5">
                      <span className="text-sm font-medium text-slate-600">
                        {format(new Date(user.createdAt), "dd/MM/yyyy")}
                      </span>
                    </TableCell>

                    <TableCell className="px-3 py-4 text-right lg:px-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-white/60"
                          >
                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/user-management/${user.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setSelectedUserForEdit(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa thông tin
                          </DropdownMenuItem>

                          {user.status === UserStatus.ACTIVE ? (
                            <DropdownMenuItem
                              className="text-amber-600 focus:text-amber-700"
                              onClick={() =>
                                setSelectedUserForStatus({
                                  id: user.id,
                                  currentStatus: user.status,
                                })
                              }
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Khóa tài khoản
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-emerald-600 focus:text-emerald-700"
                              onClick={() =>
                                setSelectedUserForStatus({
                                  id: user.id,
                                  currentStatus: user.status,
                                })
                              }
                            >
                              <Unlock className="mr-2 h-4 w-4" />
                              Mở khóa tài khoản
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex flex-shrink-0 items-center justify-center gap-5 pt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange((filters.page || 1) - 1)}
            disabled={(filters.page || 1) <= 1}
            className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="min-w-[100px] text-center text-sm font-semibold text-slate-600">
            Trang {filters.page || 1}{" "}
            <span className="mx-1 text-slate-400">/</span> {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange((filters.page || 1) + 1)}
            disabled={(filters.page || 1) >= pageCount}
            className="h-10 w-10 rounded-full border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {selectedUserForStatus && (
        <UpdateUserStatusDialog
          isOpen={!!selectedUserForStatus}
          onClose={() => setSelectedUserForStatus(null)}
          userId={selectedUserForStatus.id}
          currentStatus={selectedUserForStatus.currentStatus}
        />
      )}

      {selectedUserForEdit && (
        <UpdateUserDialog
          isOpen={!!selectedUserForEdit}
          onClose={() => setSelectedUserForEdit(null)}
          user={selectedUserForEdit}
        />
      )}
    </div>
  );
};
