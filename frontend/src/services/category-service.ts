/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import axiosInstance from "@/config/axiosConfig";
import { BaseFilter, OptionType, PaginatedResponse } from "@/types";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryNamePayload,
  UpdateCategoryStatusPayload,
} from "@/types/category";

const categoryBaseUrl = "/categories";

export const getCategoryOptions = async (
  isActive: boolean | undefined,
): Promise<OptionType[]> => {
  const response = await axiosInstance.get<{ id: string; name: string }[]>(
    `${categoryBaseUrl}/options`,
    {
      params: { isActive },
    },
  );
  return response.map((c) => ({ value: c.id, label: c.name }));
};

export const getAllCategories = async (
  filters?: BaseFilter,
): Promise<PaginatedResponse<Category>> => {
  const response = await axiosInstance.get<PaginatedResponse<Category>>(
    categoryBaseUrl,
    {
      params: filters,
    },
  );
  return response;
};

export const createCategory = async (payload: CreateCategoryPayload) => {
  await axiosInstance.post(categoryBaseUrl, {
    ...payload,
  });
};

export const updateCategoryStatus = async (
  id: string,
  payload: UpdateCategoryStatusPayload,
) => {
  await axiosInstance.patch(`${categoryBaseUrl}/${id}/status`, payload);
};

export const updateCategoryName = async (
  id: string,
  payload: UpdateCategoryNamePayload,
) => {
  await axiosInstance.patch(`${categoryBaseUrl}/${id}`, payload);
};
