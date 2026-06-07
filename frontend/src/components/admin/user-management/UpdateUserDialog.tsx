import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDepartmentOptions } from "@/hooks/queries/useDepartmentQueries";
import { useUpdateUser } from "@/hooks/queries/useUserManagementQueries";
import {
  UpdateUserPayload,
  UserResponse,
  UserRole,
} from "@/types/user-management";
import React, { useEffect, useState } from "react";

interface UpdateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse;
}

export const UpdateUserDialog: React.FC<UpdateUserDialogProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { data: departmentOptions } = useGetDepartmentOptions();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const [formData, setFormData] = useState<UpdateUserPayload>({
    fullName: user.fullName,
    email: user.email,
    password: "",
    role: user.role,
    departmentId: user.department?.id || "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        password: "",
        role: user.role,
        departmentId: user.department?.id || "",
      });
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (val: UserRole) => {
    setFormData((prev) => {
      const newData = { ...prev, role: val };
      if (
        val !== UserRole.DEPARTMENT_STAFF &&
        val !== UserRole.STAFF_ASSISTANT
      ) {
        newData.departmentId = null; // Important: null to remove department
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateUserPayload = {
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
    };
    if (formData.password) {
      payload.password = formData.password;
    }
    if (formData.departmentId !== undefined) {
      payload.departmentId = formData.departmentId;
    }

    updateUser(
      { id: user.id, payload },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const showDepartmentSelect =
    formData.role === UserRole.DEPARTMENT_STAFF ||
    formData.role === UserRole.STAFF_ASSISTANT;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật các thông tin cá nhân hoặc phân quyền của tài khoản này.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Họ và tên *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu mới (Tùy chọn)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Để trống nếu không muốn đổi mật khẩu"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Phân quyền *</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn quyền" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.STUDENT}>Sinh viên</SelectItem>
                <SelectItem value={UserRole.DEPARTMENT_STAFF}>
                  Nhân viên phòng ban
                </SelectItem>
                <SelectItem value={UserRole.STAFF_ASSISTANT}>
                  Cộng tác viên
                </SelectItem>
                <SelectItem value={UserRole.ADMIN}>Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showDepartmentSelect && (
            <div className="grid gap-2">
              <Label htmlFor="departmentId">Phòng ban *</Label>
              <Select
                value={formData.departmentId || ""}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, departmentId: val }))
                }
                required={showDepartmentSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions?.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
