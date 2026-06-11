import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDepartmentOptions } from "@/hooks/queries/useDepartmentQueries";
import { useCreateUser } from "@/hooks/queries/useUserManagementQueries";
import { cn } from "@/lib/utils";
import { CreateUserPayload, UserRole } from "@/types/user-management";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [openDepartment, setOpenDepartment] = useState(false);

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
        delete newData.departmentId;
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp.");
      return;
    }

    createUser(formData, {
      onSuccess: () => {
        setFormData({
          fullName: "",
          email: "",
          password: "",
          role: UserRole.STUDENT,
        });
        setConfirmPassword("");
        setPasswordError("");
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
              minLength={6}
              placeholder="Nhập lại mật khẩu"
            />
            {passwordError && (
              <span className="text-xs font-medium text-rose-500">
                {passwordError}
              </span>
            )}
          </div>

          <div className="grid gap-2">
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm mới
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
