"use client";
import { useQueryClient } from "@tanstack/react-query";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FEEDBACK_QUERY_KEYS,
  useForwardStaffFeedbackById,
  useUpdateStaffFeedbackStatusById,
} from "@/hooks/queries/useFeedbackQueries";
import { FeedbackStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Forward, History, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
//Define cchema validation using Zod
const updateStatusSchema = z.object({
  status: z.string().min(1, { message: "Vui lòng chọn trạng thái" }),
  note: z.string().optional(),
});
const forwardFeedbackSchema = z.object({
  toDepartmentId: z.string().min(1, { message: "Vui lòng chọn phòng ban" }),
  note: z.string().optional(),
});
// Infer the form values from the schema
type UpdateStatusValues = z.infer<typeof updateStatusSchema>;
type ForwardFeedbackValues = z.infer<typeof forwardFeedbackSchema>;

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

type StaffActionProps = {
  feedbackId: string;
  currentStatus: string;
};

const StaffAction = ({ feedbackId, currentStatus }: StaffActionProps) => {
  const queryClient = useQueryClient();

  const statusForm = useForm<UpdateStatusValues>({
    resolver: zodResolver(updateStatusSchema),
    mode: "onChange",
    defaultValues: { status: "", note: "" },
  });

  const forwardForm = useForm<ForwardFeedbackValues>({
    resolver: zodResolver(forwardFeedbackSchema),
    mode: "onChange",
    defaultValues: { toDepartmentId: "", note: "" },
  });
  // Get form validity states
  const { isValid: isStatusFormValid } = statusForm.formState;
  const { isValid: isForwardFormValid } = forwardForm.formState;

  const { mutateAsync: updateStatus } = useUpdateStaffFeedbackStatusById();
  const { mutateAsync: forwardFeedback } = useForwardStaffFeedbackById();

  const handleOnStatusSubmit = async (data: UpdateStatusValues) => {
    try {
      await updateStatus({
        id: feedbackId,
        status: data.status as FeedbackStatus,
        note: data.note,
      });
      // Refetching data to update UI dependent on query keys
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            FEEDBACK_QUERY_KEYS.staff.STAFF_FEEDBACK_DETAIL,
            feedbackId,
          ],
        }),
      ]);
      statusForm.reset();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleOnForwardSubmit = async (data: ForwardFeedbackValues) => {
    try {
      await forwardFeedback({
        id: feedbackId,
        toDepartmentId: data.toDepartmentId,
        note: data.note,
      });
      // Refetching data to update UI dependent on query keys
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            FEEDBACK_QUERY_KEYS.staff.STAFF_FEEDBACK_DETAIL,
            feedbackId,
          ],
        }),
      ]);

      forwardForm.reset();
    } catch (error) {
      console.error("Forward failed", error);
    }
  };
  const terminalStates = ["RESOLVED", "REJECTED"];
  const isFinished = terminalStates.includes(currentStatus);
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-xl bg-white/80 px-3 py-4 shadow-md lg:w-auto">
      <h3 className="text-[16px] font-semibold text-black/50">Hành động:</h3>
      <Form {...statusForm}>
        <form className="flex w-full flex-col gap-2 lg:max-w-[200px]">
          <FormField
            control={statusForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isFinished}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full cursor-pointer rounded-md border bg-white font-semibold shadow-sm focus-visible:border not-last:focus-visible:ring-0">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((item) => {
                      const isDisabled =
                        terminalStates.includes(currentStatus) ||
                        item.value === currentStatus;
                      return (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          disabled={isDisabled}
                        >
                          <item.icon
                            className={`ml-2 inline-block h-4 w-4 ${item.className}`}
                          />
                          {item.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={statusForm.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    disabled={isFinished}
                    className="max-h-[200px] w-full"
                    placeholder="Ghi chú (Không bắt buộc)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>

        <ConfirmationDialog
          title="Cập nhật trạng thái phản hồi"
          description="Bạn có chắc chắn muốn cập nhật trạng thái của phản hồi này không?"
          onConfirm={() => {
            void statusForm.handleSubmit(handleOnStatusSubmit)();
          }}
          confirmText="Đồng ý"
        >
          <Button
            type="button"
            variant={"primary"}
            disabled={!isStatusFormValid}
            className="flex w-full flex-row items-center gap-2 py-3"
          >
            <Send className="h-5 w-5" />
            Cập nhật trạng thái
          </Button>
        </ConfirmationDialog>
      </Form>

      <Dialog>
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

          <Form {...forwardForm}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void forwardForm.handleSubmit(handleOnForwardSubmit)();
              }}
              className="flex flex-col gap-4"
            >
              <FormField
                control={forwardForm.control}
                name="toDepartmentId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full min-w-[100px] cursor-pointer rounded-md border bg-white font-semibold shadow-sm focus-visible:border focus-visible:ring-0 md:min-w-[150px]">
                          <SelectValue placeholder="Chọn phòng ban" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockDepartments.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={forwardForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="max-h-[40vh]"
                        placeholder="Ghi chú (Không bắt buộc)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="cancel">
                    Hủy
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!isForwardFormValid}
                >
                  Gửi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffAction;
