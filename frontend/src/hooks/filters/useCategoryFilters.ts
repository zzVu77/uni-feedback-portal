import { BaseFilter } from "@/types";
import { useSearchParams } from "next/navigation";
import * as React from "react";

const DEFAULT_PAGE_SIZE = 10;

export function useCategoryFilters(): BaseFilter {
  const searchParams = useSearchParams();

  const filters = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const page = Number(params.get("page")) || 1;
    const pageSize = Number(params.get("pageSize")) || DEFAULT_PAGE_SIZE;
    const q = params.get("q") || "";

    const parsedFilters: BaseFilter = { page, pageSize, q };
    return parsedFilters;
  }, [searchParams]);

  return filters;
}
