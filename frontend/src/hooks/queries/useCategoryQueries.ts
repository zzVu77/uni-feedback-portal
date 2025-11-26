/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCategory,
  getAllCategories,
  getCategoryOptions,
  updateCategoryName,
  updateCategoryStatus,
} from "@/services/category-service";
import { BaseFilter } from "@/types";
import {
  CreateCategoryPayload,
  UpdateCategoryNamePayload,
} from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const CATEGORY_QUERY_KEYS = {
  CATEGORY_OPTIONS: "category-options",
  ALL_CATEGORIES: "all-categories",
};

export const useGetCategoryOptions = () => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEYS.CATEGORY_OPTIONS],
    queryFn: () => getCategoryOptions(),
    placeholderData: (previousData) => previousData,
  });
};

// Updated to accept filters
export const useGetAllCategories = (filters: BaseFilter) => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEYS.ALL_CATEGORIES, filters],
    queryFn: () => getAllCategories(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    retry: false,
    onSuccess: () => {
      toast.success("Thao tác thành công!");
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEYS.ALL_CATEGORIES],
      });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};

export const useUpdateCategoryStatus = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { isActive: boolean }) =>
      updateCategoryStatus(id, payload),
    retry: false,
    onSuccess: () => {
      toast.success("Cập nhật trạng thái danh mục thành công!");
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEYS.ALL_CATEGORIES],
      });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};

export const useUpdateCategoryName = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCategoryNamePayload) =>
      updateCategoryName(id, payload),
    retry: false,
    onSuccess: () => {
      toast.success("Cập nhật tên danh mục thành công!");
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEYS.ALL_CATEGORIES],
      });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    },
  });
};
