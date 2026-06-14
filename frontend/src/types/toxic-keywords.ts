export enum ToxicKeywordSortOption {
  KEYWORD = "keyword",
  DATE = "date",
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface ToxicKeywordResponse {
  id: string;
  keyword: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToxicKeywordListResponse {
  results: ToxicKeywordResponse[];
  total: number;
}

export interface ToxicKeywordsFilter {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: ToxicKeywordSortOption;
  orderDirection?: SortDirection;
}

export interface CreateToxicKeywordPayload {
  keyword: string;
}

export interface UpdateToxicKeywordPayload {
  keyword: string;
}
