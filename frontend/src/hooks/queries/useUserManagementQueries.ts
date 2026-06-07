/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { userManagementService } from "@/services/user-management-service";
import {
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  UserManagementFilter,
  UserViolationsFilter,
} from "@/types/user-management";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const userManagementKeys = {
  all: ["users"] as const,
  lists: () => [...userManagementKeys.all, "list"] as const,
  list: (filters: UserManagementFilter) =>
    [...userManagementKeys.lists(), { filters }] as const,
  details: () => [...userManagementKeys.all, "detail"] as const,
  detail: (id: string) => [...userManagementKeys.details(), id] as const,
  violations: (id: string, filters: UserViolationsFilter) =>
    [...userManagementKeys.detail(id), "violations", { filters }] as const,
};

export const useGetUsers = (filter: UserManagementFilter) => {
  return useQuery({
    queryKey: userManagementKeys.list(filter),
    queryFn: () => userManagementService.getUsers(filter),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: userManagementKeys.detail(id),
    queryFn: () => userManagementService.getUserById(id),
    enabled: !!id,
  });
};

export const useGetUserViolations = (
  id: string,
  filter: UserViolationsFilter,
) => {
  return useQuery({
    queryKey: userManagementKeys.violations(id, filter),
    queryFn: () => userManagementService.getUserViolations(id, filter),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      userManagementService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userManagementKeys.lists() });
      toast.success("Tạo người dùng mới thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng",
      );
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userManagementService.updateUser({ id, payload }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userManagementKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userManagementKeys.detail(variables.id),
      });
      toast.success("Cập nhật thông tin người dùng thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin",
      );
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserStatusPayload;
    }) => userManagementService.updateUserStatus({ id, payload }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userManagementKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userManagementKeys.detail(variables.id),
      });
      toast.success("Cập nhật trạng thái người dùng thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật trạng thái",
      );
    },
  });
};
