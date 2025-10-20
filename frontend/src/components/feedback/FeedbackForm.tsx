/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { FileInput } from "../common/FileInput";
import { RotateCcw, Send } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
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
const FeedbackForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      feedbackCategory: "",
      location: "",
      department: "",
      description: "",
      isPrivate: false,
      attachments: [],
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    return alert(JSON.stringify(values));
  };
  const handleResetForm = () => {
    form.reset();
    form.clearErrors();
  };

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col gap-2 rounded-[8px] bg-white px-4 py-4 shadow-md lg:px-8 lg:py-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <span className="text-[20px] font-semibold lg:text-[28px]">
            Gửi góp ý đến nhà trường
          </span>
          <ScrollArea className="overflow-y-auto pr-4">
            <div className="flex h-[76vh] flex-col gap-2">
              {/* Anonymous option */}
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="bg-neutral-light-primary-200/40 flex flex-row items-center justify-between gap-4 rounded-[8px] px-5 py-2 shadow-xs">
                        <div>
                          <p className="text-[14px] font-medium lg:text-[16px]">
                            Ẩn danh
                          </p>
                          <p className="text-muted-foreground text-[12px] font-normal lg:text-[14px]">
                            Thông tin của bạn sẽ không hiển thị với cán bộ kiểm
                            duyệt (nhưng ban quản trị cấp cao vẫn có thể xem
                            được trong những trường hợp cần thiết).
                          </p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="isPrivate"
                          className="h-6 w-12 cursor-pointer bg-gray-300 shadow-sm data-[state=checked]:bg-blue-600 [&>span]:h-5 [&>span]:w-5 [&>span]:bg-white data-[state=checked]:[&>span]:translate-x-6"
                        />
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
                      {/* <FormDescription>
                          This is your public display name.
                        </FormDescription> */}
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
                      {/* <FormDescription>
                          This is your public display name.
                        </FormDescription> */}
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
          <div className="flex flex-row items-center justify-center gap-4 lg:justify-end">
            <Button
              onClick={handleResetForm}
              type="button"
              variant={"outline"}
              className="bg-neutral-light-primary-200/20 hover:bg-neutral-light-primary-200/50 flex max-w-lg flex-row items-center gap-2 py-5 shadow-md"
            >
              <RotateCcw />
              Làm mới
            </Button>
            <Button
              type="submit"
              variant={"primary"}
              className="flex max-w-lg flex-row items-center gap-2 py-5 shadow-md"
            >
              <Send />
              Gửi góp ý
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default FeedbackForm;
