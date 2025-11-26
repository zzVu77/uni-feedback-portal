import { OptionType } from "@/types";
import { useGetCategoryOptions } from "../queries/useCategoryQueries";

export const useCategoryOptionsData = (type: "all" | "active") => {
  const isActive = type === "active" ? true : undefined;
  const { data: options } = useGetCategoryOptions(isActive);

  const categoryOptions: OptionType[] = [...(options ?? [])];

  return { data: categoryOptions };
};
