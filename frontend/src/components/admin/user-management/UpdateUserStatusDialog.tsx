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
import { useUpdateUserStatus } from "@/hooks/queries/useUserManagementQueries";
import { UserStatus } from "@/types/user-management";
import React, { useState } from "react";

interface UpdateUserStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentStatus: UserStatus;
}

export const UpdateUserStatusDialog: React.FC<UpdateUserStatusDialogProps> = ({
  isOpen,
  onClose,
  userId,
  currentStatus,
}) => {
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();
  const [durationDays, setDurationDays] = useState<string>("7");

  const isDeactivating = currentStatus === UserStatus.ACTIVE;
  const newStatus = isDeactivating ? UserStatus.DEACTIVATED : UserStatus.ACTIVE;

  const handleConfirm = () => {
    updateStatus(
      {
        id: userId,
        payload: {
          status: newStatus,
          ...(isDeactivating && durationDays
            ? { durationDays: parseInt(durationDays, 10) }
            : {}),
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isDeactivating ? "Khóa tài khoản người dùng" : "Mở khóa tài khoản"}
          </DialogTitle>
          <DialogDescription>
            {isDeactivating
              ? "Người dùng này sẽ không thể đăng nhập vào hệ thống trong thời gian bị khóa."
              : "Người dùng này sẽ có thể đăng nhập lại vào hệ thống."}
          </DialogDescription>
        </DialogHeader>

        {isDeactivating && (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="duration">Thời gian khóa (Số ngày)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="Ví dụ: 7"
              />
              <span className="text-xs text-slate-500">
                Để trống nếu không muốn tự động mở khóa (Khóa vĩnh viễn cho đến
                khi mở bằng tay).
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant={isDeactivating ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
