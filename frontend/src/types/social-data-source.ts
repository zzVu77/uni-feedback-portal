export enum Platform {
  FACEBOOK = "FACEBOOK",
  REDDIT = "REDDIT",
  OTHER = "OTHER",
}

export enum DataSourceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ERROR = "ERROR",
}

export interface SocialDataSource {
  id: string;
  url: string;
  groupName: string;
  platform: Platform;
  description?: string;
  status: DataSourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuerySocialDataSourceDto {
  page?: number;
  limit?: number;
  q?: string;
  name?: string;
  status?: DataSourceStatus;
  platform?: Platform;
}

export interface SocialDataSourceListResponse {
  results: SocialDataSource[];
  total: number;
}

export interface CreateSocialDataSourceDto {
  url: string;
  groupName: string;
  platform: Platform;
  description?: string;
}

export type UpdateSocialDataSourceDto = Partial<CreateSocialDataSourceDto>;
