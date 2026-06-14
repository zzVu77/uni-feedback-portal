/* eslint-disable */
import axiosInstance from "@/config/axiosConfig";

export interface ToxicKeyword {
  id: string;
  keyword: string;
  createdAt: string;
  updatedAt: string;
}

export const toxicKeywordsService = {
  getKeywords: async (search?: string) => {
    const params = search ? { search } : {};
    return await axiosInstance.get<ToxicKeyword[]>("/toxic-keywords", {
      params,
    });
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
