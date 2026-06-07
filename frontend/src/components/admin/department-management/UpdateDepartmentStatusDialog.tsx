"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateDepartmentStatus } from "@/hooks/queries/useDepartmentQueries";
import { Loader2 } from "lucide-react";

interface UpdateDepartmentStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  isActive: boolean;
}

export const UpdateDepartmentStatusDialog = ({
  isOpen,
  onClose,
  departmentId,
  isActive,
}: UpdateDepartmentStatusDialogProps) => {
  const { mutateAsync: updateStatus, isPending } = useUpdateDepartmentStatus();

  const handleConfirm = async () => {
    try {
      await updateStatus({
        id: departmentId,
        payload: { isActive: !isActive },
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isActive ? "Khóa phòng ban" : "Mở khóa phòng ban"}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? "Bạn có chắc chắn muốn khóa phòng ban này? Người dùng sẽ không thể gửi góp ý đến phòng ban này nữa."
              : "Bạn có chắc chắn muốn mở khóa phòng ban này? Nó sẽ xuất hiện lại trong danh sách gửi góp ý."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
            className={
              isActive
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isActive ? "Xác nhận khóa" : "Xác nhận mở khóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
