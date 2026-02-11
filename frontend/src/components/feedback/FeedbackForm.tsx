/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { useCategoryOptionsData } from "@/hooks/filters/useCategoryOptions";
import { useDepartmentOptionsData } from "@/hooks/filters/useDepartmentOptions";
import { cn } from "@/lib/utils";
import { uploadFileToCloud } from "@/services/upload-service";
import { CreateFeedbackPayload, FileAttachmentDto } from "@/types";
import { sanitizeAttachment } from "@/utils/sanitizeAttachment";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlignLeft,
  ArrowLeft,
  Check,
  ChevronsUpDown,
  FileText,
  Ghost,
  Info,
  LayoutGrid,
  Loader2,
  MapPin,
  Paperclip,
  RotateCcw,
  Save,
  Send,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import "suneditor/dist/css/suneditor.min.css";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => (
    <p className="text-sm text-slate-500">Đang tải trình soạn thảo...</p>
  ),
});

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
  const [openCategory, setOpenCategory] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const [existingFiles, setExistingFiles] = useState<FileAttachmentDto[]>([]);

  useEffect(() => {
    if (initialData?.fileAttachments) {
      setExistingFiles(initialData.fileAttachments);
    }
  }, [initialData]);

  // Remove existing file handler
  const handleRemoveExistingFile = (fileUrl: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.fileUrl !== fileUrl));
  };

  const { data: categoryOptions = [] } = useCategoryOptionsData("active");
  const { data: departmentOptions = [] } = useDepartmentOptionsData();

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
      attachments: [],
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
    // Reset existing files to initial data
    if (initialData?.fileAttachments) {
      setExistingFiles(initialData.fileAttachments);
    } else {
      setExistingFiles([]);
    }
    setEditorKey((prev) => prev + 1);
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
      setEditorKey((prev) => prev + 1);
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
          className="h-full w-full py-2"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Header Area */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
              {type === "edit" ? "Chỉnh sửa góp ý" : "Gửi góp ý đến nhà trường"}
            </h1>
            <p className="mt-1 text-slate-500">
              Hãy đóng góp ý kiến để xây dựng môi trường học tập tốt hơn.
            </p>
          </div>
          <ScrollArea className="w-full overflow-y-auto pr-1">
            <div className="flex h-full flex-col gap-6 xl:grid xl:grid-cols-12 xl:gap-4">
              {/* Left Column (Main Content) */}
              <div className="h-full lg:col-span-8">
                <div className="flex h-full flex-col gap-6 rounded-xl border border-slate-200 bg-white py-6 shadow-sm">
                  <div className="border-b border-slate-100 px-6 pb-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Chi tiết góp ý
                    </div>
                  </div>
                  <div className="space-y-6 px-6 pt-0">
                    {/* Subject Field */}
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-700">
                            Tiêu đề góp ý<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Mô tả ngắn gọn tiêu đề bạn muốn góp ý"
                              className="w-full bg-slate-50 focus-visible:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description Field */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-700">
                            Mô tả chi tiết
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <SunEditor
                              key={editorKey}
                              defaultValue={field.value}
                              onChange={(content) => {
                                const textContent = content
                                  .replace(/<[^>]+>/g, "")
                                  .trim();
                                if (!textContent) {
                                  field.onChange("");
                                } else {
                                  field.onChange(content);
                                }
                              }}
                              height="auto"
                              setOptions={{
                                minHeight: "200px",
                                buttonList: [
                                  ["undo", "redo"],
                                  ["font", "fontSize", "formatBlock"],
                                  ["bold", "italic", "underline", "strike"],
                                  ["list", "link"],
                                  ["removeFormat"],
                                ],
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* --- FILE ATTACHMENTS SECTION --- */}
                    <div className="space-y-4">
                      <FormLabel className="flex items-center gap-2 font-semibold text-slate-700">
                        <Paperclip className="h-4 w-4" /> Tệp đính kèm
                      </FormLabel>

                      {/* 1. Display Existing Files (Edit Mode) */}
                      {existingFiles.length > 0 && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <p className="mb-3 text-sm font-medium text-slate-700">
                            Tệp hiện tại:
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {existingFiles.map((file) => (
                              <div
                                key={file.fileUrl}
                                className="group flex items-center justify-between rounded-md border border-slate-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md"
                              >
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
                                    <FileText className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <a
                                      href={file.fileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block truncate text-sm font-medium text-slate-700 hover:text-blue-600"
                                    >
                                      {file.fileName}
                                    </a>
                                    <p className="text-xs text-slate-400">
                                      {(file.fileSize / 1024 / 1024).toFixed(2)}{" "}
                                      MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
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
                </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="flex h-full flex-col gap-4 xl:col-span-4">
                {/* Classification Group */}
                <div className="flex h-full flex-col gap-6 rounded-xl border border-slate-200 bg-white py-4 shadow-sm">
                  <div className="border-b border-slate-100 px-6 pb-6">
                    <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                      <LayoutGrid className="h-5 w-5 text-purple-500" />
                      Thông tin liên quan
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 px-6">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold text-slate-700">
                            Danh mục<span className="text-red-500">*</span>
                          </FormLabel>
                          <Popover
                            open={openCategory}
                            onOpenChange={setOpenCategory}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between bg-slate-50 font-normal hover:bg-slate-100",
                                    !field.value && "text-slate-500",
                                  )}
                                >
                                  {field.value
                                    ? categoryOptions.find(
                                        (option) =>
                                          option.value === field.value,
                                      )?.label
                                    : "Chọn danh mục"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[--radix-popover-trigger-width] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Tìm kiếm danh mục..." />
                                <CommandList>
                                  <CommandEmpty>
                                    Không tìm thấy danh mục.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {categoryOptions.map((option) => (
                                      <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                          form.setValue(
                                            "categoryId",
                                            option.value,
                                          );
                                          setOpenCategory(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            option.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {option.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold text-slate-700">
                            Phòng ban<span className="text-red-500">*</span>
                          </FormLabel>
                          <Popover
                            open={openDepartment}
                            onOpenChange={setOpenDepartment}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between bg-slate-50 font-normal hover:bg-slate-100",
                                    !field.value && "text-slate-500",
                                  )}
                                >
                                  {field.value
                                    ? departmentOptions.find(
                                        (option) =>
                                          option.value === field.value,
                                      )?.label
                                    : "Chọn phòng ban"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[--radix-popover-trigger-width] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Tìm kiếm phòng ban..." />
                                <CommandList>
                                  <CommandEmpty>
                                    Không tìm thấy phòng ban.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {departmentOptions.map((option) => (
                                      <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                          form.setValue(
                                            "departmentId",
                                            option.value,
                                          );
                                          setOpenDepartment(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            option.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {option.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-700">
                            Địa điểm (nếu có)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                              <Input
                                className="w-full bg-slate-50 pl-9 focus-visible:ring-blue-500"
                                placeholder="VD: Tầng 2, Phòng A101"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Settings Group */}
                <div className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white py-4 shadow-sm">
                  <div className="border-b border-slate-100 px-6 pb-6">
                    <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                      <AlignLeft className="h-5 w-5 text-orange-500" />
                      Quyền riêng tư
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 px-6">
                    {/* Anonymous Option */}
                    <FormField
                      control={form.control}
                      name="isAnonymous"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2 text-base font-semibold text-slate-800">
                                <Ghost className="h-4 w-4 text-slate-500" />
                                Gửi ẩn danh
                              </FormLabel>
                              <p className="text-xs text-slate-500">
                                Ẩn thông tin cá nhân của bạn
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          {/* Warning Animation */}
                          {field.value && (
                            <div className="animate-in fade-in slide-in-from-top-2 mt-3">
                              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                <div className="mb-1 flex items-center gap-2 font-semibold">
                                  <ShieldAlert className="h-4 w-4" />
                                  Lưu ý quan trọng
                                </div>
                                <p className="text-xs leading-relaxed text-amber-700">
                                  Thông tin sẽ ẩn với phòng ban xử lý, nhưng{" "}
                                  <span className="font-bold">
                                    Ban quản trị
                                  </span>{" "}
                                  vẫn có thể truy cập để đảm bảo an toàn & minh
                                  bạch.
                                </p>
                              </div>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Public Option */}
                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem>
                          <div
                            className={`flex items-center justify-between rounded-lg border border-slate-100 p-3 shadow-sm ${isAnonymousWatched ? "bg-slate-50 opacity-60" : ""}`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <FormLabel className="text-base font-semibold text-slate-800">
                                  Công khai
                                </FormLabel>
                              </div>
                              <p className="text-xs text-slate-500">
                                Đăng lên diễn đàn
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isAnonymousWatched}
                              />
                            </FormControl>
                          </div>

                          {/* Warning Animation / Info Section */}
                          {isAnonymousWatched ? (
                            <div className="animate-in fade-in slide-in-from-top-2 mt-3">
                              <div className="rounded-md border border-slate-200 bg-blue-50 p-3 text-sm text-slate-600">
                                <div className="mb-1 flex items-center gap-2 font-semibold text-blue-800">
                                  <Info className="h-4 w-4" />
                                  Lưu ý
                                </div>
                                <p className="text-xs leading-relaxed text-blue-700">
                                  Không thể công khai khi đang ở chế độ ẩn danh.
                                </p>
                              </div>
                            </div>
                          ) : (
                            field.value && (
                              <div className="animate-in fade-in slide-in-from-top-2 mt-3">
                                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                                  <div className="mb-1 flex items-center gap-2 font-semibold">
                                    <Info className="h-4 w-4" />
                                    Chế độ công khai
                                  </div>
                                  <p className="text-xs leading-relaxed text-blue-700">
                                    Phản hồi sẽ được đăng lên diễn đàn để mọi
                                    người cùng thảo luận.
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer Buttons */}
            <div className="py-4">
              <div className="mx-auto flex items-center justify-center gap-4 lg:justify-end lg:px-0">
                {type === "create" ? (
                  <>
                    <ConfirmationDialog
                      title="Xác nhận làm mới?"
                      description="Hành động này sẽ xóa toàn bộ thông tin bạn đã nhập."
                      onConfirm={handleResetForm}
                      confirmText="Đồng ý"
                    >
                      <Button
                        type="button"
                        disabled={!isDirty || isPending}
                        variant="outline"
                        className="gap-2 border-slate-300 text-slate-600 hover:bg-slate-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Làm mới
                      </Button>
                    </ConfirmationDialog>

                    <Button
                      type="button"
                      disabled={!isDirty || isPending}
                      onClick={handleAttemptSubmit}
                      className="gap-2 bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isUploading
                        ? "Đang tải tệp..."
                        : isPending
                          ? "Đang gửi..."
                          : "Gửi góp ý"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        router.replace(`/student/my-feedbacks/${id}`);
                      }}
                      className="gap-2 border-blue-300 text-white"
                      disabled={isPending}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Quay lại
                    </Button>

                    <Button
                      type="button"
                      className="gap-2 bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                      disabled={isPending || !canSubmit}
                      onClick={handleUpdateFeedback}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isUploading
                        ? "Đang tải tệp..."
                        : isPending
                          ? "Đang cập nhật..."
                          : "Lưu thay đổi"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </form>
      </Form>

      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-slate-800">
              Xác nhận gửi góp ý
            </AlertDialogTitle>
            <AlertDialogDescription
              asChild
              className="space-y-3 text-sm leading-relaxed text-slate-600"
            >
              <div>
                <p>
                  Góp ý của bạn sẽ được gửi đến phòng ban liên quan để tiếp nhận
                  và xử lý. Bạn vẫn có thể{" "}
                  <span className="font-semibold text-emerald-600">
                    chỉnh sửa
                  </span>{" "}
                  hoặc <span className="font-semibold text-red-600">xóa</span>{" "}
                  góp ý này trong mục{" "}
                  <span className="font-medium">"Lịch sử góp ý"</span> trước khi
                  góp ý được tiếp nhận xử lý.
                </p>
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                  <p className="mb-1 font-semibold text-slate-700">
                    Chính sách ẩn danh:
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Thông tin cá nhân được ẩn với các phòng ban xử lý.</li>
                    <li>
                      Ban quản trị cấp cao có thể truy xuất khi cần thiết để đảm
                      bảo an toàn.
                    </li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="rounded-lg">
              Xem lại
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendFeedback}
              disabled={isPending}
              className="rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Đang xử lý..." : "Xác nhận gửi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FeedbackForm;
