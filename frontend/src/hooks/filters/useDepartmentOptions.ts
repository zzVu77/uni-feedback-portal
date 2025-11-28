import { OptionType } from "@/types";
import { useGetDepartmentOptions } from "../queries/useDepartmentQueries";

export const useDepartmentOptionsData = () => {
  const { data: options } = useGetDepartmentOptions();

  const departmentOptions: OptionType[] = [...(options ?? [])];

  return { data: departmentOptions };
};
