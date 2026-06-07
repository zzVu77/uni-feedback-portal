/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createDepartment,
  getDepartmentDetailInfo,
  getDepartmentOptions,
  getDepartments,
  updateDepartment,
  updateDepartmentStatus,
} from "@/services/department-service";
import {
  CreateDepartmentPayload,
  DepartmentManagementFilter,
  UpdateDepartmentPayload,
  UpdateDepartmentStatusPayload,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DEPARTMENT_QUERY_KEYS = {
  all: ["departments"] as const,
  lists: () => [...DEPARTMENT_QUERY_KEYS.all, "list"] as const,
  list: (filter: DepartmentManagementFilter) =>
    [...DEPARTMENT_QUERY_KEYS.lists(), filter] as const,
  details: () => [...DEPARTMENT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DEPARTMENT_QUERY_KEYS.details(), id] as const,
  DEPARTMENT_OPTIONS: "department-options",
};
export const useGetDepartmentOptions = () => {
  return useQuery({
    queryKey: [DEPARTMENT_QUERY_KEYS.DEPARTMENT_OPTIONS],
    queryFn: () => getDepartmentOptions(),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetDepartmentDetail = (departmentId: string) => {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.detail(departmentId),
    queryFn: () => getDepartmentDetailInfo(departmentId),
    enabled: !!departmentId,
  });
};

export const useGetDepartments = (filter: DepartmentManagementFilter) => {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.list(filter),
    queryFn: () => getDepartments(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DEPARTMENT_QUERY_KEYS.lists(),
      });
      toast.success("Thêm phòng ban mới thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo phòng ban",
      );
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDepartmentPayload;
    }) => updateDepartment({ id, payload }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: DEPARTMENT_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: DEPARTMENT_QUERY_KEYS.detail(variables.id),
      });
      toast.success("Cập nhật thông tin phòng ban thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật phòng ban",
      );
    },
  });
};

export const useUpdateDepartmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDepartmentStatusPayload;
    }) => updateDepartmentStatus({ id, payload }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: DEPARTMENT_QUERY_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: DEPARTMENT_QUERY_KEYS.detail(variables.id),
      });
      toast.success("Cập nhật trạng thái phòng ban thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật trạng thái",
      );
    },
  });
};
