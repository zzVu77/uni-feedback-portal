"use client";

import { useState } from "react";
import { Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTriggerGithubAction } from "@/hooks/queries/useGithubActionQueries";

export function TriggerPipelineButton() {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutateAsync: triggerPipeline, isPending } = useTriggerGithubAction();

  const handleTrigger = async () => {
    try {
      await triggerPipeline({
        owner: "zzVu77",
        repo: "uni-feedback-portal",
        workflowId: "daily-pipeline.yml",
        ref: "main",
        inputs: {},
      });
      setOpen(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error triggering pipeline:", error);
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto">
            <Play className="mr-2 h-4 w-4" />
            Phân tích dữ liệu ngay
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[24px] p-6 sm:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Xác nhận kích hoạt Pipeline
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-slate-600">
              Hành động này sẽ gọi Github Action để tiến hành cào dữ liệu mới
              nhất từ các nguồn mạng xã hội (Facebook Groups) hiện tại và phân
              tích bằng AI. Quá trình có thể mất vài phút. Bạn có chắc chắn muốn
              chạy ngay bây giờ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="h-11 rounded-full px-6 font-semibold">
              Hủy
            </AlertDialogCancel>
            <Button
              className="h-11 rounded-full bg-emerald-600 px-6 font-semibold text-white shadow-md hover:bg-emerald-700"
              onClick={handleTrigger}
              disabled={isPending}
            >
              {isPending ? "Đang kích hoạt..." : "Xác nhận chạy"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent className="max-w-md rounded-[24px] p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-emerald-100 p-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold text-slate-800">
                Kích hoạt thành công!
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-center text-base text-slate-600">
                Data Pipeline đã được bắt đầu trên GitHub Actions. Quá trình thu
                thập và phân tích dữ liệu AI sẽ diễn ra ngầm. Vui lòng quay lại
                kiểm tra biểu đồ và dữ liệu sau khoảng{" "}
                <b className="text-emerald-700">5-7 phút</b> nữa.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 w-full">
              <AlertDialogAction className="h-12 w-full rounded-full bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-700">
                Đã hiểu
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
