import {
  UserManagementFilter,
  UserRole,
  UserStatus,
} from "@/types/user-management";
import { useSearchParams } from "next/navigation";
import * as React from "react";

const DEFAULT_PAGE_SIZE = 10;

export function useUserManagementFilters(): UserManagementFilter {
  const searchParams = useSearchParams();
  const filters = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || DEFAULT_PAGE_SIZE;
    const search = params.get("q") || undefined;

    // role can be a comma separated string or a single value if coming from multiple params
    // But since our CommonFilter sets a single "role" param, we just use it.
    // Except when we want to default to an array based on tab.
    const roleParam = params.get("role");
    const role =
      roleParam && roleParam !== "all" ? (roleParam as UserRole) : undefined;

    const statusParam = params.get("status");
    const status =
      statusParam && statusParam !== "all"
        ? (statusParam as UserStatus)
        : undefined;

    const departmentId = params.get("departmentId") || undefined;

    const parsedFilters: UserManagementFilter = { page, limit };
    if (search) parsedFilters.search = search;
    if (role) parsedFilters.role = role;
    if (status) parsedFilters.status = status;
    if (departmentId) parsedFilters.departmentId = departmentId;

    return parsedFilters;
  }, [searchParams]);

  return filters;
}
