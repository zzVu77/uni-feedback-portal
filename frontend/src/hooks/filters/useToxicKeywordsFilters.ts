import {
  SortDirection,
  ToxicKeywordSortOption,
  ToxicKeywordsFilter,
} from "@/types/toxic-keywords";
import { useSearchParams } from "next/navigation";
import * as React from "react";

const DEFAULT_PAGE_SIZE = 10;

export function useToxicKeywordsFilters(): ToxicKeywordsFilter {
  const searchParams = useSearchParams();

  const filters = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || DEFAULT_PAGE_SIZE;
    const search = params.get("q") || undefined;

    const orderByParam = params.get("orderBy");
    const orderBy = Object.values(ToxicKeywordSortOption).includes(
      orderByParam as ToxicKeywordSortOption,
    )
      ? (orderByParam as ToxicKeywordSortOption)
      : undefined;

    const orderDirectionParam = params.get("orderDirection");
    const orderDirection = Object.values(SortDirection).includes(
      orderDirectionParam as SortDirection,
    )
      ? (orderDirectionParam as SortDirection)
      : undefined;

    const parsedFilters: ToxicKeywordsFilter = { page, limit };
    if (search) parsedFilters.search = search;
    if (orderBy) parsedFilters.orderBy = orderBy;
    if (orderDirection) parsedFilters.orderDirection = orderDirection;

    return parsedFilters;
  }, [searchParams]);

  return filters;
}
