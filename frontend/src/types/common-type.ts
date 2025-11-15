export interface PaginatedResponse<TData> {
  results: TData[];
  total: number;
}
export interface BaseFilter {
  page: number;
  pageSize: number;
  limit?: number;
  q?: string;
}
