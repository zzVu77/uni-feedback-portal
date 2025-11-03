/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Save, Send, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { FileInput } from "../common/FileInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain", // .txt
];
const formSchema = z.object({
  subject: z
    .string()
    .min(3, {
      message: "Tiêu đề phải có ít nhất 3 ký tự.",
    })
    .max(500, {
      message: "Tiêu đề chỉ có tối đa 500 ký tự.",
    }),
  feedbackCategory: z
    .string()
    .min(1, { message: "Vui lòng chọn một danh mục." }),
  department: z.string().min(1, { message: "Vui lòng chọn một phòng ban." }),

  location: z
    .string()

    .max(100, {
      message: "Tối đa 100 ký tự.",
    })
    .optional(),
  description: z
    .string()
    .min(1, { message: "Vui lòng nhập mô tả chi tiết." })
    .max(5000, {
      message: "Tối đa 5000 ký tự.",
    }),
  isPrivate: z.boolean().optional(),
  attachments: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE),
      `Kích thước file tối đa là 100MB.`,
    )
    .refine(
      (files) =>
        !files ||
        files.every((file) => ACCEPTED_FILE_TYPES.includes(file.type)),
      "Chỉ chấp nhận các định dạng .jpg, .png, .pdf, .docx, .txt",
    ),
});
type FeedbackFormProps = {
  type?: "create" | "edit";
  initialData?: z.infer<typeof formSchema>;
};
const FeedbackForm = ({ type = "edit", initialData }: FeedbackFormProps) => {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: initialData?.subject || "",
      feedbackCategory: initialData?.feedbackCategory || "",
      location: initialData?.location || "",
      department: initialData?.department || "",
      description: initialData?.description || "",
      isPrivate: initialData?.isPrivate || false,
      attachments: initialData?.attachments || [],
    },
  });
  const { isDirty } = form.formState;
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    alert(JSON.stringify(values));
    setIsSubmitDialogOpen(false);
    form.reset();
  };
  const handleResetForm = () => {
    form.reset();
    form.clearErrors();
  };
  const handleAttemptSubmit = async () => {
    const isFormValid = await form.trigger();
    if (isFormValid) {
      setIsSubmitDialogOpen(true);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="flex h-[100%] flex-col gap-2 rounded-[8px] bg-white px-4 py-4 shadow-md lg:px-8 lg:py-4"
          onSubmit={(e) => e.preventDefault()} // prevent default submit
        >
          <h2 className="mb-2 text-[20px] font-semibold lg:text-[28px]">
            {type === "edit" ? "Chỉnh sửa góp ý" : "Gửi góp ý đến nhà trường"}
          </h2>
          <ScrollArea className="overflow-y-auto pr-1">
            <div className="flex h-[76vh] flex-col gap-4 px-2">
              {/* Anonymous option */}
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="bg-neutral-light-primary-200/40 flex flex-row items-center justify-between gap-4 rounded-[8px] px-5 py-2 shadow-sm">
                        <div className="flex flex-col gap-2">
                          <div className="flex w-full flex-row items-center justify-between gap-4 lg:justify-start">
                            <p className="text-[15px] font-medium lg:text-[16px]">
                              Ẩn danh
                            </p>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="isPrivate"
                              className="h-6 w-12 cursor-pointer bg-gray-300 shadow-sm data-[state=checked]:bg-blue-600 [&>span]:h-5 [&>span]:w-5 [&>span]:bg-white data-[state=checked]:[&>span]:translate-x-6"
                            />
                          </div>
                          <p className="text-[14px]">
                            Nếu bạn chọn gửi{" "}
                            <span className="text-blue-primary-600 font-medium">
                              Ẩn danh
                            </span>
                            , thông tin cá nhân của bạn sẽ
                            <span className="font-medium text-green-700">
                              {" "}
                              không hiển thị với các phòng ban xử lý
                            </span>
                            .
                          </p>

                          <p className="text-[14px] text-gray-700 italic">
                            Tuy nhiên, trong một số trường hợp đặc biệt,
                            <span className="font-medium text-amber-500">
                              {" "}
                              ban quản trị cấp cao{" "}
                            </span>
                            vẫn có thể truy cập thông tin này để đảm bảo
                            <span className="font-medium text-pink-500">
                              {" "}
                              tính minh bạch
                            </span>{" "}
                            và
                            <span className="text-purple-primary-500 font-medium">
                              {" "}
                              an toàn
                            </span>
                            .
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Subject Field */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề góp ý</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mô tả ngắn gọn tiêu đề bạn muốn góp ý"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category Selection and Location Input */}
              <div className="flex w-full flex-col items-start justify-between gap-5 lg:flex-row">
                {/* Category Selection */}
                <FormField
                  control={form.control}
                  name="feedbackCategory"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Danh mục góp ý</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Danh mục</SelectLabel>
                              <SelectItem value="thuvien">Thư viện</SelectItem>
                              <SelectItem value="giang_vien">
                                Giảng viên
                              </SelectItem>
                              <SelectItem value="hoc_lieu">Học liệu</SelectItem>
                              <SelectItem value="co_so_vat_chat">
                                Cơ sở vật chất
                              </SelectItem>
                              <SelectItem value="khac">Khác</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Department Selection */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phòng ban tiếp nhận</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn phòng ban " />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Phòng ban</SelectLabel>
                              <SelectItem value="khoa_dtqt">
                                Khoa ĐTQT
                              </SelectItem>
                              <SelectItem value="khoa_cntt">
                                Khoa CNTT
                              </SelectItem>
                              <SelectItem value="khoa_kinh_te">
                                Khoa Kinh tế
                              </SelectItem>
                              <SelectItem value="khoa_ngoai_ngu">
                                Khoa Ngoại ngữ
                              </SelectItem>
                              <SelectItem value="khac">Khác</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Location Input */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Địa điểm cụ thể (nếu có)</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Ví dụ: Tầng 2, Phòng A101"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả chi tiết</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết vấn đề bạn muốn góp ý"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Attachments */}
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tệp đính kèm (nếu có)</FormLabel>
                    <FormControl>
                      <FileInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
          {type == "create" ? (
            <div className="border-neutral-light-primary-300 flex flex-row items-center justify-center gap-4 border-t-1 pt-2 lg:justify-end">
              <ConfirmationDialog
                title="Xác nhận làm mới biểu mẫu?"
                description="Hành động này sẽ xóa toàn bộ thông tin bạn đã nhập. Bạn có muốn tiếp tục không?"
                onConfirm={handleResetForm}
                confirmText="Đồng ý"
              >
                <Button
                  type="button"
                  disabled={!isDirty}
                  variant={"cancel"}
                  className="flex max-w-lg flex-row items-center gap-2 py-3"
                >
                  <RotateCcw className="h-5 w-5" />
                  Làm mới
                </Button>
              </ConfirmationDialog>

              <Button
                type="button"
                disabled={!isDirty}
                variant={"primary"}
                onClick={handleAttemptSubmit}
                className="flex max-w-lg flex-row items-center gap-2 py-3 shadow-md"
              >
                <Send className="h-5 w-5" />
                Gửi góp ý
              </Button>
            </div>
          ) : (
            <div className="border-neutral-light-primary-300 flex flex-row items-center justify-center gap-4 border-t-1 pt-2 lg:justify-end">
              <Button
                type="button"
                variant={"cancel"}
                onClick={() => {}} // TODO: Implement cancel functionality ( back again to detail page )
                className="flex max-w-lg flex-row items-center gap-2 py-3"
              >
                <X className="h-5 w-5" />
                Hủy
              </Button>
              <ConfirmationDialog
                title="Bạn có chắc chắn muốn cập nhật góp ý này?"
                description="Hành động này sẽ làm thay đổi góp ý cũ của bạn. Bạn có muốn tiếp tục không?"
                onConfirm={handleResetForm}
                confirmText="Đồng ý"
              >
                <Button
                  type="button"
                  onClick={() => {}} // TODO: Implement update functionality
                  variant={"primary"}
                  className="bg-green-primary-400 hover:bg-green-primary-500 flex max-w-lg flex-row items-center gap-2 py-3"
                >
                  <Save className="h-5 w-5" />
                  Cập nhật
                </Button>
              </ConfirmationDialog>
            </div>
          )}
        </form>
      </Form>
      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vui lòng xác nhận trước khi gửi</AlertDialogTitle>

            <AlertDialogDescription
              asChild
              className="space-y-2 text-sm leading-relaxed text-gray-600"
            >
              <div>
                <p>
                  Sau khi nhấn{" "}
                  <span className="text-blue-primary-600 font-medium">
                    “Gửi”
                  </span>
                  , bạn sẽ
                  <span className="font-semibold text-red-600">
                    {" "}
                    không thể chỉnh sửa hoặc hủy bỏ{" "}
                  </span>
                  góp ý đã gửi.
                </p>
                <p className="text-[14px]">
                  Nếu bạn chọn gửi{" "}
                  <span className="text-blue-primary-600 font-medium">
                    Ẩn danh
                  </span>
                  , thông tin cá nhân của bạn sẽ
                  <span className="font-medium text-green-700">
                    {" "}
                    không hiển thị với các phòng ban xử lý
                  </span>
                  .
                </p>
                <p className="text-[14px] text-gray-700 italic">
                  Tuy nhiên, trong một số trường hợp đặc biệt,
                  <span className="font-medium text-amber-500">
                    {" "}
                    ban quản trị cấp cao{" "}
                  </span>
                  vẫn có thể truy cập thông tin này để đảm bảo
                  <span className="font-medium text-pink-500">
                    {" "}
                    tính minh bạch
                  </span>{" "}
                  và
                  <span className="text-purple-primary-500 font-medium">
                    {" "}
                    an toàn
                  </span>
                  .
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
              Gửi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FeedbackForm;
