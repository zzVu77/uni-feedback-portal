import { AnnouncementFilter } from "@/types";
import { useSearchParams } from "next/navigation";
import * as React from "react";

const DEFAULT_PAGE_SIZE = 10;

export function useAnnouncementFilters(): AnnouncementFilter {
  const searchParams = useSearchParams();
  const filters = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const page = Number(params.get("page")) || 1;
    const pageSize = Number(params.get("pageSize")) || DEFAULT_PAGE_SIZE;
    const title = params.get("q");
    const department = params.get("departmentId") || undefined;
    const parsedFilters: AnnouncementFilter = { page, pageSize };
    if (title) parsedFilters.q = title;
    if (department) parsedFilters.departmentId = department || "";
    return parsedFilters;
  }, [searchParams]);

  return filters;
}
