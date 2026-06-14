/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createToxicKeyword,
  deleteToxicKeyword,
  getToxicKeywords,
  updateToxicKeyword,
} from "@/services/toxic-keywords.service";
import {
  CreateToxicKeywordPayload,
  ToxicKeywordsFilter,
  UpdateToxicKeywordPayload,
} from "@/types/toxic-keywords";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const toxicKeywordsKeys = {
  all: ["toxic-keywords"] as const,
  lists: () => [...toxicKeywordsKeys.all, "list"] as const,
  list: (filters: ToxicKeywordsFilter) =>
    [...toxicKeywordsKeys.lists(), { filters }] as const,
};

export const useGetToxicKeywords = (filter: ToxicKeywordsFilter) => {
  return useQuery({
    queryKey: toxicKeywordsKeys.list(filter),
    queryFn: () => getToxicKeywords(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateToxicKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateToxicKeywordPayload) =>
      createToxicKeyword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toxicKeywordsKeys.lists() });
      toast.success("Thêm từ khóa cấm thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi thêm từ khóa",
      );
    },
  });
};

export const useUpdateToxicKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateToxicKeywordPayload;
    }) => updateToxicKeyword(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toxicKeywordsKeys.lists() });
      toast.success("Cập nhật từ khóa cấm thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật từ khóa",
      );
    },
  });
};

export const useDeleteToxicKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteToxicKeyword(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toxicKeywordsKeys.lists() });
      toast.success("Xóa từ khóa cấm thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi xóa từ khóa",
      );
    },
  });
};
