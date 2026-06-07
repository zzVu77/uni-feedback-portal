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
import { useCreateUser } from "@/hooks/queries/useUserManagementQueries";
import { CreateUserPayload, UserRole } from "@/types/user-management";
import React, { useState } from "react";

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: departmentOptions } = useGetDepartmentOptions();
  const { mutate: createUser, isPending } = useCreateUser();

  const [formData, setFormData] = useState<CreateUserPayload>({
    fullName: "",
    email: "",
    password: "",
    role: UserRole.STUDENT,
  });

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
        delete newData.departmentId;
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(formData, {
      onSuccess: () => {
        setFormData({
          fullName: "",
          email: "",
          password: "",
          role: UserRole.STUDENT,
        });
        onClose();
      },
    });
  };

  const showDepartmentSelect =
    formData.role === UserRole.DEPARTMENT_STAFF ||
    formData.role === UserRole.STAFF_ASSISTANT;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo người dùng mới</DialogTitle>
          <DialogDescription>
            Điền thông tin bên dưới để cấp tài khoản mới trong hệ thống.
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
              placeholder="Vd: Nguyễn Văn A"
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
              placeholder="Vd: email@example.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Ít nhất 6 ký tự"
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
              {isPending ? "Đang xử lý..." : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
