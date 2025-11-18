import { OptionType } from "@/types";
import { useGetCategoryOptions } from "../queries/useCategoryQueries";

export const useCategoryOptionsData = () => {
  const { data: options } = useGetCategoryOptions();

  const categoryOptions: OptionType[] = [...(options ?? [])];

  return { data: categoryOptions };
};
