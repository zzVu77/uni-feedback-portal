import axiosInstance from "@/config/axiosConfig";
import {
  CreateSocialDataSourceDto,
  QuerySocialDataSourceDto,
  SocialDataSource,
  SocialDataSourceListResponse,
  UpdateSocialDataSourceDto,
} from "@/types/social-data-source";

const baseUrl = "/social-data-source";

export const getAllSocialDataSources = async (
  params?: QuerySocialDataSourceDto,
): Promise<SocialDataSourceListResponse> => {
  const response = await axiosInstance.get<SocialDataSourceListResponse>(
    baseUrl,
    {
      params,
    },
  );
  return response;
};

export const getSocialDataSourceById = async (
  id: string,
): Promise<SocialDataSource> => {
  const response = await axiosInstance.get<SocialDataSource>(
    `${baseUrl}/${id}`,
  );
  return response;
};

export const createSocialDataSource = async (
  data: CreateSocialDataSourceDto,
): Promise<SocialDataSource> => {
  const response = await axiosInstance.post<SocialDataSource>(baseUrl, data);
  return response;
};

export const updateSocialDataSource = async (
  id: string,
  data: UpdateSocialDataSourceDto,
): Promise<SocialDataSource> => {
  const response = await axiosInstance.patch<SocialDataSource>(
    `${baseUrl}/${id}`,
    data,
  );
  return response;
};

export const updateSocialDataSourceStatus = async (
  id: string,
  status: string,
): Promise<SocialDataSource> => {
  const response = await axiosInstance.patch<SocialDataSource>(
    `${baseUrl}/${id}/status`,
    { status },
  );
  return response;
};

export const deleteSocialDataSource = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${baseUrl}/${id}`);
};
