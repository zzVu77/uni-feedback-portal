import axiosInstance from "@/config/axiosConfig";
import { OptionType } from "@/types";

const departmentBaseUrl = "/departments";
export const getDepartmentOptions = async (): Promise<OptionType[]> => {
  const response = await axiosInstance.get<{ id: string; name: string }[]>(
    `${departmentBaseUrl}/options`,
  );
  return response.map((d) => ({ value: d.id, label: d.name }));
};
