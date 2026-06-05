import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Settings } from "lucide-react";
import {
  Platform,
  SocialDataSource,
  DataSourceStatus,
} from "@/types/social-data-source";
import {
  useUpdateSocialDataSource,
  useUpdateSocialDataSourceStatus,
} from "@/hooks/queries/useSocialDataSourceQueries";

const formSchema = z.object({
  url: z.string().url({ message: "URL không hợp lệ" }),
  groupName: z.string().min(2, { message: "Tên group quá ngắn" }),
  platform: z.nativeEnum(Platform),
  description: z.string().optional(),
  status: z.nativeEnum(DataSourceStatus),
});

export function EditDataSourceDialog({
  dataSource,
}: {
  dataSource: SocialDataSource;
}) {
  const [open, setOpen] = useState(false);
  const { mutate: updateDataSource, isPending: isLoadingUpdate } =
    useUpdateSocialDataSource(dataSource.id);
  const { mutate: updateStatus, isPending: isLoadingStatus } =
    useUpdateSocialDataSourceStatus(dataSource.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: dataSource.url,
      groupName: dataSource.groupName,
      platform: dataSource.platform,
      description: dataSource.description || "",
      status: dataSource.status,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateDataSource(
      {
        url: values.url,
        groupName: values.groupName,
        platform: values.platform,
        description: values.description,
      },
      {
        onSuccess: () => {
          if (values.status !== dataSource.status) {
            updateStatus(values.status, {
              onSuccess: () => {
                setOpen(false);
              },
            });
          } else {
            setOpen(false);
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white/80 text-slate-600 shadow-sm hover:bg-white"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nguồn dữ liệu</DialogTitle>
          <DialogDescription>
            Thay đổi thông tin hoặc trạng thái của nguồn dữ liệu này.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.facebook.com/groups/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hiển thị</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Hội sinh viên HCMUTE..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nền tảng</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nền tảng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Platform.FACEBOOK}>
                          Facebook
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={DataSourceStatus.ACTIVE}>
                          Hoạt động
                        </SelectItem>
                        <SelectItem value={DataSourceStatus.INACTIVE}>
                          Tạm dừng
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ghi chú về nhóm này..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isLoadingUpdate || isLoadingStatus}
                className="bg-indigo-600"
              >
                {isLoadingUpdate || isLoadingStatus
                  ? "Đang lưu..."
                  : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
