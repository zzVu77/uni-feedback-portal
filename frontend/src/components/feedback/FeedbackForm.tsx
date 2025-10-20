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
});
const FeedbackForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      feedbackCategory: "",
      location: "",
      description: "",
      isPrivate: false,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    return alert(JSON.stringify(values));
  };

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col gap-5 rounded-[8px] bg-white p-3 shadow-xs"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <span className="text-[20px] font-semibold lg:text-[28px]">
            Gửi góp ý đến nhà trường
          </span>
          {/* Anonymous option */}
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="bg-neutral-light-primary-200/40 flex flex-row items-center justify-between rounded-[8px] px-5 py-2 shadow-xs">
                    <div>
                      <p className="text-[16px] font-medium">Ẩn danh</p>
                      <p className="text-muted-foreground text-[14px] font-normal">
                        Thông tin của bạn sẽ không hiển thị với cán bộ kiểm
                        duyệt (nhưng ban quản trị cấp cao vẫn có thể xem được
                        trong những trường hợp cần thiết).
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
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
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

          <Button type="submit" variant={"primary"}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default FeedbackForm;
