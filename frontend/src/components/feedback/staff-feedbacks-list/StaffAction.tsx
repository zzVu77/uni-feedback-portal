/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, Forward, History, Send, X } from "lucide-react";
const statusOptions = [
  {
    label: "Đang xử lý",
    value: "IN_PROGRESS",
    icon: History,
    className: "text-blue-500",
  },
  {
    label: "Đã giải quyết",
    value: "RESOLVED",
    icon: Check,
    className: "text-green-500",
  },
  { label: "Từ chối", value: "REJECTED", icon: X, className: "text-red-500" },
];
const mockDepartments = [
  { label: "Công nghệ thông tin", value: "IT" },
  { label: "Hành chính nhân sự", value: "HR" },
  { label: "Tài chính kế toán", value: "Finance" },
  { label: "Marketing", value: "Marketing" },
];
const StaffAction = () => {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-[8px] bg-white/80 px-3 py-4 shadow-md">
      <h3 className="text-[16px] font-semibold text-black/50">Hành động:</h3>
      <Select>
        <SelectTrigger className="md:mim-w-[150px] h-10 w-full min-w-[100px] cursor-pointer rounded-md border-[1px] bg-white font-semibold shadow-sm focus-visible:border-[1px] focus-visible:ring-0">
          <SelectValue placeholder="Chọn trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <item.icon
                className={`ml-2 inline-block h-4 w-4 ${item.className}`}
              />
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea placeholder="Ghi chú (Không bắt buộc) " />
      <ConfirmationDialog
        title="Cập nhật trạng thái phản hồi"
        description="Bạn có chắc chắn muốn cập nhật trạng thái của phản hồi này không?"
        onConfirm={() => {}}
        confirmText="Đồng ý"
      >
        <Button
          type="button"
          //   disabled={!isDirty}
          variant={"primary"}
          className="flex w-full flex-row items-center gap-2 py-3"
        >
          <Send className="h-5 w-5" />
          Cập nhật trạng thái
        </Button>
      </ConfirmationDialog>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-amber-400 hover:bg-amber-500"
              variant="primary"
            >
              <Forward />
              Chuyển tiếp phản hồi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <DialogTitle>Chuyển tiếp phản hồi</DialogTitle>
              <DialogDescription>
                Chọn phòng ban bạn muốn chuyển tiếp phản hồi này đến và kèm theo
                ghi chú.
              </DialogDescription>
            </AlertDialogHeader>
            <Select>
              <SelectTrigger className="md:mim-w-[150px] h-10 w-full min-w-[100px] cursor-pointer rounded-md border-[1px] bg-white font-semibold shadow-sm focus-visible:border-[1px] focus-visible:ring-0">
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {mockDepartments.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea placeholder="Ghi chú (Không bắt buộc) " />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="cancel">Hủy</Button>
              </DialogClose>
              <Button type="submit" variant="primary">
                Gửi
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default StaffAction;
