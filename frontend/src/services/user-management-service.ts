/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/config/axiosConfig";
import {
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  UserListResponse,
  UserManagementFilter,
  UserResponse,
  UserViolationsFilter,
  UserViolationsResponse,
} from "@/types/user-management";

export const userManagementService = {
  getUsers: async (filter: UserManagementFilter): Promise<UserListResponse> => {
    const params = { ...filter };
    if (Array.isArray(params.role)) {
      params.role = params.role.join(",") as any;
    }
    const response = await axiosClient.get<UserListResponse>("/users", {
      params,
    });
    return response;
  },

  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await axiosClient.get<UserResponse>(`/users/${id}`);
    return response;
  },

  getUserViolations: async (
    id: string,
    filter: UserViolationsFilter,
  ): Promise<UserViolationsResponse> => {
    const response = await axiosClient.get<UserViolationsResponse>(
      `/users/${id}/violations`,
      {
        params: filter,
      },
    );
    return response;
  },

  createUser: async (payload: CreateUserPayload): Promise<UserResponse> => {
    const response = await axiosClient.post<UserResponse>("/users", payload);
    return response;
  },

  updateUser: async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateUserPayload;
  }): Promise<UserResponse> => {
    const response = await axiosClient.patch<UserResponse>(
      `/users/${id}`,
      payload,
    );
    return response;
  },

  updateUserStatus: async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateUserStatusPayload;
  }): Promise<UserResponse> => {
    const response = await axiosClient.patch<UserResponse>(
      `/users/${id}/status`,
      payload,
    );
    return response;
  },
};
