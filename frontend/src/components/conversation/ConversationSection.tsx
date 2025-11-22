/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
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
import {
  CLARIFICATION_QUERY_KEYS,
  useCloseConversationById,
  useCreateNewConversation,
  useGetAllClarificationsByFeedbackId,
} from "@/hooks/queries/useClarificationQueries";
import { ConversationBodyParams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageCircleMore, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ConversationItem from "./ConversationItem";
// --- Schema ---
const newConversationSchema = z.object({
  subject: z.string().min(1, "Vui lòng nhập tiêu đề cuộc trao đổi"),
  initialMessage: z.string().min(1, "Vui lòng nhập nội dung tin nhắn"),
});

type NewConversationFormValues = z.infer<typeof newConversationSchema>;

interface NewConversationFormProps {
  onCancel: () => void;
  onSubmit: (values: NewConversationFormValues) => Promise<void>;
  isPending: boolean;
}

const NewConversationForm = ({
  onCancel,
  onSubmit,
  isPending,
}: NewConversationFormProps) => {
  const form = useForm<NewConversationFormValues>({
    resolver: zodResolver(newConversationSchema),
    defaultValues: {
      subject: "",
      initialMessage: "",
    },
  });

  const { isDirty } = form.formState;

  return (
    <div className="w-full border-t border-neutral-200 px-2 py-4">
      <h3 className="mb-4 text-[16px] font-semibold">Cuộc hội thoại mới</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Subject */}
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
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message */}
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
                    disabled={isPending}
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
              disabled={isPending}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              disabled={!isDirty || isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isPending ? "Đang gửi..." : "Bắt đầu cuộc hội thoại"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// --- Component: ConversationSection ---
interface ConversationSectionProps {
  role: "student" | "staff";
  currentFeedbackStatus: string;
}
const ConversationSection = ({
  role,
  currentFeedbackStatus,
}: ConversationSectionProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const params = useParams();
  const feedbackId = params.id as string;

  // Queries
  const defaultFilters = { feedbackId, page: 1, pageSize: 50 };
  const { data: listConversation } =
    useGetAllClarificationsByFeedbackId(defaultFilters);
  const queryClient = useQueryClient();
  const { mutateAsync: createConversation, isPending } =
    useCreateNewConversation();

  // Derived State
  const conversations = listConversation?.results || [];
  const hasConversations = conversations.length > 0;
  const allConversationsClosed = conversations.every(
    (c) => c.isClosed === true,
  );

  // Logic to determine if "Create New Conversation" button should be shown
  const canCreateNew =
    (!hasConversations || allConversationsClosed) &&
    role === "staff" &&
    currentFeedbackStatus !== "RESOLVED" &&
    currentFeedbackStatus !== "REJECTED";
  // Handler
  const { mutateAsync: closeConversation } = useCloseConversationById();

  const handleCreateSubmit = async (values: NewConversationFormValues) => {
    const payload: ConversationBodyParams = {
      feedbackId,
      subject: values.subject,
      initialMessage: values.initialMessage,
    };
    try {
      await createConversation(payload);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [CLARIFICATION_QUERY_KEYS, defaultFilters],
        }),
      ]);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleCloseConversation = async (id: string) => {
    try {
      await closeConversation(id);
      await queryClient.invalidateQueries({
        queryKey: [CLARIFICATION_QUERY_KEYS, defaultFilters],
      });
    } catch (error) {
      console.error("Failed to close conversation:", error);
    }
  };

  return (
    <div className="flex max-h-[650px] min-h-[250px] w-full flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-row items-center gap-2 border-b border-transparent pb-2">
        <MessageCircleMore className="h-6 w-6 text-neutral-700" />
        <h2 className="text-[18px] font-medium text-neutral-700">Trao đổi</h2>
      </div>

      <ScrollArea className="mr-3 w-full flex-1 pr-3">
        <div className="flex flex-col gap-4 py-1">
          {/* VIEW 1: CREATE FORM MODE */}
          {isCreating ? (
            <NewConversationForm
              onCancel={() => setIsCreating(false)}
              onSubmit={handleCreateSubmit}
              isPending={isPending}
            />
          ) : (
            /* VIEW 2: DISPLAY LIST OR EMPTY STATE */
            <>
              {!hasConversations ? (
                // Empty State
                <div className="flex flex-col items-center justify-center gap-3 py-10">
                  <MessageCircleMore className="h-12 w-12 text-neutral-400" />
                  <span className="text-center text-[15px] font-medium text-neutral-400">
                    Chưa có cuộc trao đổi nào được tạo.
                  </span>
                </div>
              ) : (
                // List State
                <div className="w-full pb-1">
                  <ConversationItem
                    data={conversations}
                    role={role}
                    onClose={(id: string) => handleCloseConversation(id)}
                  />
                </div>
              )}

              {/* CREATE BUTTON */}
              {/* Only show when not in create mode AND (no conversations OR all are closed) */}
              {canCreateNew && (
                <Button
                  variant="primary"
                  className="mx-auto w-fit bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsCreating(true)}
                >
                  <MessageCircleMore className="mr-2 h-4 w-4" />
                  Yêu cầu trao đổi
                </Button>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationSection;
