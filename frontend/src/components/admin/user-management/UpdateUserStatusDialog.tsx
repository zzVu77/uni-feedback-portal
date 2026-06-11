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
import { cn } from "@/lib/utils";

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
  const [lockType, setLockType] = useState<"temporary" | "permanent">(
    "temporary",
  );

  const isDeactivating = currentStatus === UserStatus.ACTIVE;

  const handleConfirm = () => {
    let targetStatus = UserStatus.ACTIVE;
    let payloadDuration: number | undefined = undefined;

    if (isDeactivating) {
      if (lockType === "temporary") {
        targetStatus = UserStatus.DEACTIVATED;
        payloadDuration = durationDays ? parseInt(durationDays, 10) : 7;
      } else {
        targetStatus = UserStatus.PERMANENTLY_DELETED;
      }
    }
    updateStatus(
      {
        id: userId,
        payload: {
          status: targetStatus,
          ...(payloadDuration !== undefined
            ? { durationDays: payloadDuration }
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
            <div className="grid grid-cols-2 gap-3">
              <div
                className={cn(
                  "cursor-pointer rounded-lg border p-3 transition-all",
                  lockType === "temporary"
                    ? "border-amber-600 bg-amber-50 ring-1 ring-amber-600"
                    : "border-slate-200 hover:bg-slate-50",
                )}
                onClick={() => setLockType("temporary")}
              >
                <div className="text-sm font-semibold text-slate-800">
                  Khóa có thời hạn
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Tự động mở khóa sau số ngày chỉ định
                </div>
              </div>
              <div
                className={cn(
                  "cursor-pointer rounded-lg border p-3 transition-all",
                  lockType === "permanent"
                    ? "border-rose-600 bg-rose-50 ring-1 ring-rose-600"
                    : "border-slate-200 hover:bg-slate-50",
                )}
                onClick={() => setLockType("permanent")}
              >
                <div className="text-sm font-semibold text-slate-800">
                  Khóa vô thời hạn
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Tài khoản sẽ bị khóa cho đến khi được quản trị viên mở khóa.
                </div>
              </div>
            </div>

            {lockType === "temporary" && (
              <div className="mt-2 flex flex-col gap-2">
                <Label htmlFor="duration">Thời gian khóa (Số ngày) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="Ví dụ: 7"
                  required
                />
              </div>
            )}
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
