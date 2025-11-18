/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCategoryOptions } from "@/services/category-service";
import { useQuery } from "@tanstack/react-query";

export const CATEGORY_QUERY_KEYS = {
  CATEGORY_OPTIONS: "category-options",
};
export const useGetCategoryOptions = () => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEYS.CATEGORY_OPTIONS],
    queryFn: () => getCategoryOptions(),
    placeholderData: (previousData) => previousData,
  });
};
