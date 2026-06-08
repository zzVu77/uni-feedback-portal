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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [openDepartment, setOpenDepartment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        password: "",
        role: user.role,
        departmentId: user.department?.id || "",
      });
      setConfirmPassword("");
      setPasswordError("");
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "password") {
      setPasswordError("");
    }
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

    if (formData.password && formData.password !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp.");
      return;
    }

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

          {formData.password && (
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                required
                placeholder="Nhập lại mật khẩu"
              />
              {passwordError && (
                <span className="text-xs font-medium text-rose-500">
                  {passwordError}
                </span>
              )}
            </div>
          )}

          <div className="grid w-full gap-2">
            <Label htmlFor="role">Phân quyền *</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
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
              <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between font-normal",
                      !formData.departmentId && "text-muted-foreground",
                    )}
                  >
                    {formData.departmentId
                      ? departmentOptions?.find(
                          (opt) => opt.value === formData.departmentId,
                        )?.label
                      : "Chọn phòng ban"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Tìm kiếm phòng ban..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy phòng ban.</CommandEmpty>
                      <CommandGroup>
                        {departmentOptions?.map((opt) => (
                          <CommandItem
                            key={opt.value}
                            value={opt.label}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                departmentId: opt.value,
                              }));
                              setOpenDepartment(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                opt.value === formData.departmentId
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {opt.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
