import { NotificationFilter } from "@/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useNotificationFilters = (): NotificationFilter => {
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      //   tab: searchParams.get("tab") || "all",
      //   status: searchParams.get("notificationStatus") || "all",
      //   sort: searchParams.get("sort") || "newest",
    };
  }, [searchParams]);

  return filters;
};
