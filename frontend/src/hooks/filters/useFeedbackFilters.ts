import { useSearchParams } from "next/navigation";
import * as React from "react";
import { FeedbackFilter, FeedbackStatus } from "@/types";

const DEFAULT_PAGE_SIZE = 10;

export function useFeedbackFilters(): FeedbackFilter {
  const searchParams = useSearchParams();
  const filters = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const page = Number(params.get("page")) || 1;
    const pageSize = Number(params.get("pageSize")) || DEFAULT_PAGE_SIZE;
    const title = params.get("q");
    const status = params.get("status") || "";
    const department = params.get("departmentId") || undefined;
    const parsedFilters: FeedbackFilter = { page, pageSize };
    if (title) parsedFilters.q = title;
    if (status) parsedFilters.status = status as FeedbackStatus;
    if (department) parsedFilters.departmentId = department || "";

    return parsedFilters;
  }, [searchParams]);

  return filters;
}
