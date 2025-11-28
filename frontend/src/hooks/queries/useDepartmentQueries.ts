/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getDepartmentDetailInfo,
  getDepartmentOptions,
} from "@/services/department-service";
import { useQuery } from "@tanstack/react-query";

export const DEPARTMENT_QUERY_KEYS = {
  DEPARTMENT_OPTIONS: "department-options",
};
export const useGetDepartmentOptions = () => {
  return useQuery({
    queryKey: [DEPARTMENT_QUERY_KEYS.DEPARTMENT_OPTIONS],
    queryFn: () => getDepartmentOptions(),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetDepartmentDetail = (departmentId: string) => {
  return useQuery({
    queryKey: [DEPARTMENT_QUERY_KEYS.DEPARTMENT_OPTIONS, departmentId],
    queryFn: () => getDepartmentDetailInfo(departmentId),
  });
};
