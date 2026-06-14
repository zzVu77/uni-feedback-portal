/* eslint-disable */
import axiosInstance from "@/config/axiosConfig";

export interface ToxicKeyword {
  id: string;
  keyword: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetToxicKeywordsParams {
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: "keyword" | "date";
  orderDirection?: "asc" | "desc";
}

export interface GetToxicKeywordsResponse {
  results: ToxicKeyword[];
  total: number;
}

export const toxicKeywordsService = {
  getKeywords: async (params?: GetToxicKeywordsParams) => {
    return await axiosInstance.get<GetToxicKeywordsResponse>(
      "/toxic-keywords",
      {
        params,
      },
    );
  },

  createKeyword: async (keyword: string) => {
    return await axiosInstance.post<ToxicKeyword>("/toxic-keywords", {
      keyword,
    });
  },

  updateKeyword: async (id: string, keyword: string) => {
    return await axiosInstance.patch<ToxicKeyword>(`/toxic-keywords/${id}`, {
      keyword,
    });
  },

  deleteKeyword: async (id: string) => {
    return await axiosInstance.delete(`/toxic-keywords/${id}`);
  },
};
