/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/config/axiosConfig";
import {
  CreateToxicKeywordPayload,
  ToxicKeywordListResponse,
  ToxicKeywordResponse,
  ToxicKeywordsFilter,
  UpdateToxicKeywordPayload,
} from "@/types/toxic-keywords";

const baseUrl = "/toxic-keywords";

export const getToxicKeywords = async (
  filter: ToxicKeywordsFilter,
): Promise<ToxicKeywordListResponse> => {
  // Map our frontend "limit" to backend "pageSize"
  const params: any = { ...filter };
  if (params.limit !== undefined) {
    params.pageSize = params.limit;
    delete params.limit;
  }

  const response = await axiosInstance.get<ToxicKeywordListResponse>(baseUrl, {
    params,
  });
  return response;
};

export const createToxicKeyword = async (
  payload: CreateToxicKeywordPayload,
): Promise<ToxicKeywordResponse> => {
  const response = await axiosInstance.post<ToxicKeywordResponse>(
    baseUrl,
    payload,
  );
  return response;
};

export const updateToxicKeyword = async (
  id: string,
  payload: UpdateToxicKeywordPayload,
): Promise<ToxicKeywordResponse> => {
  const response = await axiosInstance.patch<ToxicKeywordResponse>(
    `${baseUrl}/${id}`,
    payload,
  );
  return response;
};

export const deleteToxicKeyword = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${baseUrl}/${id}`);
};
