/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { useCategoryOptionsData } from "@/hooks/filters/useCategoryOptions";
import { useDepartmentOptionsData } from "@/hooks/filters/useDepartmentOptions";
import { CreateFeedbackPayload, FileAttachmentDto } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Info,
  RotateCcw,
  Save,
  Send,
  X,
  Loader2,
  FileText,
  Trash2,
} from "lucide-react"; // Thêm icon FileText, Trash2, Loader2
import { useEffect, useState } from "react";
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
import { useRouter, useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { uploadFileToCloud } from "@/services/upload-service"; // Import Service Upload
import { toast } from "sonner"; // Import Toast
import { sanitizeAttachment } from "@/utils/sanitizeAttachment";

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
  categoryId: z.string().min(1, { message: "Vui lòng chọn một danh mục." }),
  departmentId: z.string().min(1, { message: "Vui lòng chọn một phòng ban." }),

  location: z
    .string()
    .max(100, {
      message: "Tối đa 100 ký tự.",
    })
    .optional(),
  description: z
    .string()
    .min(10, { message: "Vui lòng nhập mô tả chi tiết. Tối thiểu 10 ký tự." })
    .max(5000, {
      message: "Tối đa 5000 ký tự.",
    }),
  isAnonymous: z.boolean().optional(),
  isPublic: z.boolean().optional(),
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
  initialData?: CreateFeedbackPayload;
  onSubmit: (values: CreateFeedbackPayload) => Promise<void>;
  isPending?: boolean;
};

const FeedbackForm = ({
  type = "edit",
  initialData,
  onSubmit,
  isPending: isMutationPending,
}: FeedbackFormProps) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // State quản lý upload

  const [existingFiles, setExistingFiles] = useState<FileAttachmentDto[]>([]);

  useEffect(() => {
    if (initialData?.fileAttachments) {
      setExistingFiles(initialData.fileAttachments);
    }
  }, [initialData]);

  // Hàm xóa file cũ khỏi danh sách hiển thị
  const handleRemoveExistingFile = (fileUrl: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.fileUrl !== fileUrl));
  };

  const { data: categoryOptions } = useCategoryOptionsData("active");
  const { data: departmentOptions } = useDepartmentOptionsData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: initialData?.subject || "",
      location: initialData?.location || "",
      categoryId: initialData?.categoryId || "",
      departmentId: initialData?.departmentId || "",
      description: initialData?.description || "",
      isAnonymous: initialData?.isAnonymous || false,
      isPublic: initialData?.isPublic || false,
      attachments: [], // Input file luôn bắt đầu là rỗng (chứa file mới)
    },
  });

  const mapFormValuesToFeedbackParams = (
    values: z.infer<typeof formSchema>,
  ): CreateFeedbackPayload => {
    return {
      subject: values.subject,
      categoryId: values.categoryId,
      departmentId: values.departmentId,
      location: values.location || "",
      description: values.description,
      isAnonymous: values.isAnonymous || false,
      isPublic: values.isPublic || false,
      // fileAttachments sẽ được xử lý riêng
    };
  };

  const isAnonymousWatched = form.watch("isAnonymous");

  useEffect(() => {
    if (isAnonymousWatched) {
      form.setValue("isPublic", false);
    }
  }, [isAnonymousWatched, form]);

  const { isDirty } = form.formState;

  // Check dirty
  const isExistingFilesChanged =
    type === "edit" &&
    initialData?.fileAttachments &&
    existingFiles.length !== initialData.fileAttachments.length;

  const canSubmit = isDirty || isExistingFilesChanged;

  const handleResetForm = () => {
    form.reset();
    form.clearErrors();
    // Reset lại cả danh sách file cũ về ban đầu
    if (initialData?.fileAttachments) {
      setExistingFiles(initialData.fileAttachments);
    } else {
      setExistingFiles([]);
    }
  };

  const handleAttemptSubmit = async () => {
    const isFormValid = await form.trigger();
    if (isFormValid) {
      setIsSubmitDialogOpen(true);
    }
  };

  // --- LOGIC CREATE FEEDBACK ---
  const handleSendFeedback = form.handleSubmit(async (values) => {
    setIsUploading(true);
    try {
      // 1. Upload new files
      let uploadedAttachments: FileAttachmentDto[] = [];
      if (values.attachments && values.attachments.length > 0) {
        const rawAttachments = await Promise.all(
          values.attachments.map((file) => uploadFileToCloud(file)),
        );
        // FIX: Encode URL for uploaded files
        uploadedAttachments = rawAttachments.map(sanitizeAttachment);
      }

      // 2. Prepare payload
      const payload = {
        ...mapFormValuesToFeedbackParams(values),
        fileAttachments: uploadedAttachments,
      };

      // 3. Submit
      await onSubmit(payload);
      form.reset();
      setExistingFiles([]);
      setIsSubmitDialogOpen(false);
      setTimeout(() => {
        router.replace(`/student/my-feedbacks`);
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi gửi góp ý:", error);
      toast.error("Có lỗi xảy ra khi tải tệp lên hoặc gửi dữ liệu.");
    } finally {
      setIsUploading(false);
    }
  });

  // --- LOGIC UPDATE FEEDBACK ---
  const handleUpdateFeedback = form.handleSubmit(async (values) => {
    setIsUploading(true);
    try {
      // 1. Upload new files
      let newUploadedAttachments: FileAttachmentDto[] = [];
      if (values.attachments && values.attachments.length > 0) {
        const rawAttachments = await Promise.all(
          values.attachments.map((file) => uploadFileToCloud(file)),
        );
        // FIX: Encode URL cho file mới upload
        newUploadedAttachments = rawAttachments.map(sanitizeAttachment);
      }

      // 2. Process existing files (also need to encode to be sure)
      const processedExistingFiles = existingFiles
        .filter((file) => file.fileUrl && file.fileUrl.trim() !== "")
        .map(sanitizeAttachment);

      // 3.Combine existing + new
      const finalAttachments = [
        ...processedExistingFiles,
        ...newUploadedAttachments,
      ];

      const payload = {
        ...mapFormValuesToFeedbackParams(values),
        fileAttachments: finalAttachments,
      };

      await onSubmit(payload);
      setTimeout(() => {
        router.replace(`/student/my-feedbacks/${id}`);
      }, 1000);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setIsUploading(false);
    }
  });

  const isPending = isMutationPending || isUploading;

  return (
    <>
      <Form {...form}>
        <form
          className="flex h-full flex-col gap-2 rounded-xl bg-white px-4 py-4 shadow-md lg:px-8 lg:py-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="mb-2 text-[20px] font-semibold lg:text-[28px]">
            {type === "edit" ? "Chỉnh sửa góp ý" : "Gửi góp ý đến nhà trường"}
          </h2>
          <ScrollArea className="overflow-y-auto pr-1">
            <div className="flex h-[76vh] flex-col gap-4 px-2">
              {/* Anonymous option */}
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="bg-neutral-light-primary-200/40 flex flex-row items-center justify-between gap-4 rounded-xl px-5 py-2 shadow-sm">
                        <div className="flex flex-col gap-2">
                          <div className="flex w-full flex-row items-center justify-between gap-4 lg:justify-start">
                            <p className="text-[15px] font-medium lg:text-[16px]">
                              Ẩn danh
                            </p>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="isAnonymous"
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
              {/* Public to forum option */}
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="mt-2 flex flex-row items-center space-y-0 space-x-3 px-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isPublic"
                        disabled={isAnonymousWatched}
                        className={`h-6 w-12 bg-gray-300 shadow-sm data-[state=checked]:bg-blue-600 [&>span]:h-5 [&>span]:w-5 [&>span]:bg-white data-[state=checked]:[&>span]:translate-x-6 ${isAnonymousWatched ? "cursor-not-allowed opacity-50" : "cursor-pointer"} `}
                      />
                    </FormControl>
                    <div
                      className={`flex items-center gap-2 ${isAnonymousWatched ? "opacity-50" : ""}`}
                    >
                      <FormLabel
                        htmlFor="isPublic"
                        className="cursor-pointer text-[15px] font-medium text-gray-700"
                      >
                        Công khai trên diễn đàn
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 cursor-pointer text-gray-400 transition-colors hover:text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-slate-800 p-2 text-center text-xs text-white">
                            <p className="text-center">
                              {isAnonymousWatched
                                ? "Không thể công khai khi gửi ẩn danh."
                                : "Phản hồi sẽ được đăng lên diễn đàn cho phép tất cả sinh viên để thảo luận và chia sẻ ý kiến."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Danh mục góp ý</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Danh mục</SelectLabel>
                              {categoryOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phòng ban tiếp nhận</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn phòng ban " />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Phòng ban</SelectLabel>
                              {departmentOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

              {/* --- FILE ATTACHMENTS SECTION --- */}
              <div className="space-y-4">
                {/* 1. Hiển thị danh sách file ĐÃ CÓ (Edit Mode) */}
                {existingFiles.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Tệp đính kèm hiện tại:
                    </p>
                    <div className="space-y-2">
                      {existingFiles.map((file) => (
                        <div
                          key={file.fileUrl}
                          className="flex items-center justify-between rounded-md border border-gray-100 bg-white p-2 text-sm shadow-sm"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-4 w-4 flex-shrink-0 text-blue-500" />
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate text-blue-600 hover:underline"
                            >
                              {file.fileName}
                            </a>
                            <span className="text-xs text-gray-400">
                              ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() =>
                              handleRemoveExistingFile(file.fileUrl)
                            }
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Input Upload File MỚI */}
                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {type === "edit" && existingFiles.length > 0
                          ? "Thêm tệp đính kèm mới (nếu có)"
                          : "Tệp đính kèm (nếu có)"}
                      </FormLabel>
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
            </div>
          </ScrollArea>

          {/* Buttons Area */}
          {type == "create" ? (
            <div className="border-neutral-light-primary-300 flex flex-row items-center justify-center gap-4 border-t pt-2 lg:justify-end">
              <ConfirmationDialog
                title="Xác nhận làm mới biểu mẫu?"
                description="Hành động này sẽ xóa toàn bộ thông tin bạn đã nhập. Bạn có muốn tiếp tục không?"
                onConfirm={handleResetForm}
                confirmText="Đồng ý"
              >
                <Button
                  type="button"
                  disabled={!isDirty || isPending}
                  variant={"cancel"}
                  className="flex max-w-lg flex-row items-center gap-2 py-3"
                >
                  <RotateCcw className="h-5 w-5" />
                  Làm mới
                </Button>
              </ConfirmationDialog>

              <Button
                type="button"
                disabled={!isDirty || isPending}
                variant={"primary"}
                onClick={handleAttemptSubmit}
                className="flex max-w-lg flex-row items-center gap-2 py-3 shadow-md"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                {isUploading
                  ? "Đang tải tệp..."
                  : isPending
                    ? "Đang gửi..."
                    : "Gửi góp ý"}
              </Button>
            </div>
          ) : (
            <div className="border-neutral-light-primary-300 flex flex-row items-center justify-center gap-4 border-t pt-2 lg:justify-end">
              <Button
                type="button"
                variant={"cancel"}
                onClick={() => {
                  router.replace(`/student/my-feedbacks/${id}`);
                }}
                className="flex max-w-lg flex-row items-center gap-2 py-3"
                disabled={isPending}
              >
                <X className="h-5 w-5" />
                Hủy
              </Button>

              <Button
                type="button"
                variant={"primary"}
                className="bg-green-primary-400 hover:bg-green-primary-500 flex max-w-lg flex-row items-center gap-2 py-3"
                disabled={isPending || !canSubmit}
                onClick={handleUpdateFeedback}
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isUploading
                  ? "Đang tải tệp..."
                  : isPending
                    ? "Đang cập nhật..."
                    : "Cập nhật"}
              </Button>
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
                {/* (Giữ nguyên phần mô tả dài như cũ) */}
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
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendFeedback}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Đang xử lý..." : "Gửi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FeedbackForm;
