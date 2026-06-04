/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSocialDataSource,
  getAllSocialDataSources,
  getSocialDataSourceById,
  updateSocialDataSource,
  updateSocialDataSourceStatus,
  deleteSocialDataSource,
} from "@/services/social-data-source-service";
import {
  CreateSocialDataSourceDto,
  QuerySocialDataSourceDto,
  UpdateSocialDataSourceDto,
} from "@/types/social-data-source";

export const SOCIAL_DATA_SOURCE_QUERY_KEYS = {
  ALL: "all-social-data-sources",
  DETAIL: "detail-social-data-source",
};

export const useGetSocialDataSources = (
  query: QuerySocialDataSourceDto = {},
) => {
  return useQuery({
    queryKey: [SOCIAL_DATA_SOURCE_QUERY_KEYS.ALL, query],
    queryFn: () => getAllSocialDataSources(query),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetSocialDataSourceById = (id: string) => {
  return useQuery({
    queryKey: [SOCIAL_DATA_SOURCE_QUERY_KEYS.DETAIL, id],
    queryFn: () => getSocialDataSourceById(id),
    enabled: !!id,
  });
};

export const useCreateSocialDataSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSocialDataSourceDto) =>
      createSocialDataSource(payload),
    onSuccess: () => {
      toast.success("Thêm mới nguồn dữ liệu thành công!");
      queryClient.invalidateQueries({
        queryKey: [SOCIAL_DATA_SOURCE_QUERY_KEYS.ALL],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi thêm nguồn dữ liệu!",
      );
    },
  });
};

export const useUpdateSocialDataSource = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSocialDataSourceDto) =>
      updateSocialDataSource(id, payload),
    onSuccess: () => {
      toast.success("Cập nhật nguồn dữ liệu thành công!");
      queryClient.invalidateQueries({
        queryKey: [SOCIAL_DATA_SOURCE_QUERY_KEYS.ALL],
      });
      queryClient.invalidateQueries({
        queryKey: [SOCIAL_DATA_SOURCE_QUERY_KEYS.DETAIL, id],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật nguồn dữ liệu!",
      );
    },
  });
};

export const useUpdateSocialDataSourceStatus = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => updateSocialDataSourceStatus(id, status),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({
        queryKey: [SOCIAL_DATA_SOURCE_QUERY_KEYS.ALL],
      });
      queryClient.invalidateQueries({
        queryKey: [SOCIAL_DATA_SOURCE_QUERY_KEYS.DETAIL, id],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật trạng thái!",
      );
    },
  });
};

export const useDeleteSocialDataSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSocialDataSource(id),
    onSuccess: () => {
      toast.success("Xóa nguồn dữ liệu thành công!");
      queryClient.invalidateQueries({
        queryKey: [SOCIAL_DATA_SOURCE_QUERY_KEYS.ALL],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi xóa nguồn dữ liệu!",
      );
    },
  });
};
