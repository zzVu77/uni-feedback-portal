import { ReportCommentFilter } from "@/types";
import { useSearchParams } from "next/navigation";
import * as React from "react";

const DEFAULT_PAGE_SIZE = 10;

export function useReportCommentFilters(): ReportCommentFilter {
  const searchParams = useSearchParams();
  const filters = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const page = Number(params.get("page")) || 1;
    const pageSize = Number(params.get("pageSize")) || DEFAULT_PAGE_SIZE;
    const status = params.get("status") as ReportCommentFilter["status"];
    const q = params.get("q") || undefined;
    const reportReason = params.get(
      "reportReason",
    ) as ReportCommentFilter["reportReason"];
    const parsedFilters: ReportCommentFilter = { page, pageSize };
    if (status) parsedFilters.status = status;
    if (q) parsedFilters.q = q;
    if (reportReason) parsedFilters.reportReason = reportReason;
    return parsedFilters;
  }, [searchParams]);

  return filters;
}
