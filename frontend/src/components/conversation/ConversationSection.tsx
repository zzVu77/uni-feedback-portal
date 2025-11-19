/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircleMore, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ConversationItem from "./ConversationItem";
import { cn } from "@/lib/utils";
import { useGetAllClarificationsByFeedbackId } from "@/hooks/queries/useClarificationQueries";
import { useParams } from "next/navigation";

// --- Types ---
type Message = {
  typeOfUser: "STAFF" | "STUDENT";
  isReceived: boolean;
  content: string;
  name: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  isClosed: boolean;
  subject: string;
  listMessage: Message[];
};

const newConversationSchema = z.object({
  subject: z.string().min(1, "Vui lòng nhập tiêu đề cuộc trao đổi"),
  initialMessage: z.string().min(1, "Vui lòng nhập nội dung tin nhắn"),
});

interface NewConversationFormProps {
  onCancel: () => void;
  onSubmitSuccess: () => void;
}

const NewConversationForm = ({
  onCancel,
  onSubmitSuccess,
}: NewConversationFormProps) => {
  const form = useForm<z.infer<typeof newConversationSchema>>({
    resolver: zodResolver(newConversationSchema),
    defaultValues: {
      subject: "",
      initialMessage: "",
    },
  });
  const { isDirty } = form.formState;

  const handleSubmit = async () => {
    const isFormValid = await form.trigger();
    if (isFormValid) {
      onSubmitSuccess();
    }
  };

  return (
    <div className="w-full border-t border-neutral-200 px-2 py-4">
      <h3 className="mb-4 text-[16px] font-semibold">Cuộc hội thoại mới</h3>
      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          {/* Subject Field */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-700">
                  Tiêu đề
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tiêu đề cuộc trao đổi"
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={form.control}
            name="initialMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-700">
                  Tin nhắn
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập nội dung tin nhắn..."
                    className="min-h-[100px] resize-none bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              disabled={!isDirty}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />
              Bắt đầu cuộc hội thoại
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ConversationSection = () => {
  const [isCreating, setIsCreating] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const { data: listConversation } = useGetAllClarificationsByFeedbackId({
    feedbackId: id,
    page: 1,
    pageSize: 10,
  });

  const isNotAnyConversationOpen =
    listConversation &&
    listConversation.results.every(
      (conversation) => conversation.isClosed === true,
    );

  return (
    <div className="flex max-h-[650px] min-h-[250px] w-full flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-row items-center gap-2 border-b border-transparent pb-2">
        <MessageCircleMore className="h-6 w-6 text-neutral-700" />
        <h2 className="text-[18px] font-medium text-neutral-700">Trao đổi</h2>
      </div>

      <ScrollArea className="mr-3 w-full flex-1 pr-3">
        <div className="flex flex-col gap-4 py-1">
          {listConversation &&
            listConversation.results.length > 0 &&
            isNotAnyConversationOpen &&
            (isCreating ? (
              // display create form
              <NewConversationForm
                onCancel={() => setIsCreating(false)}
                onSubmitSuccess={() => {
                  alert("Đã gửi yêu cầu tạo hội thoại!");
                  setIsCreating(false);
                }}
              />
            ) : null)}
          {listConversation && listConversation.results.length === 0 ? (
            // CASE 1: Have no conversation yet
            isCreating ? (
              // display create form
              <NewConversationForm
                onCancel={() => setIsCreating(false)}
                onSubmitSuccess={() => {
                  alert("Đã gửi yêu cầu tạo hội thoại!");
                  setIsCreating(false);
                }}
              />
            ) : (
              // display empty state + request button
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <MessageCircleMore className="h-12 w-12 text-neutral-400" />
                <span className="text-center text-[15px] font-medium text-neutral-400">
                  Chưa có cuộc trao đổi nào được tạo.
                </span>
              </div>
            )
          ) : (
            // CASE 2: Have conversation list
            <ScrollArea
              className={cn(
                listConversation &&
                  listConversation.results.length > 0 &&
                  isNotAnyConversationOpen &&
                  isCreating &&
                  "hidden",
                "w-full flex-1 pr-4",
              )}
            >
              <div className="flex max-h-[350px] flex-col gap-4">
                {listConversation && (
                  <div className="w-full pb-1">
                    <ConversationItem data={listConversation.results} />
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          {listConversation &&
            (isNotAnyConversationOpen ||
              listConversation.results.length === 0) &&
            !isCreating && (
              <Button
                variant="primary"
                className="mx-auto w-fit"
                onClick={() => setIsCreating(true)}
              >
                <MessageCircleMore />
                Yêu cầu mở cuộc hội thoại
              </Button>
            )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationSection;
