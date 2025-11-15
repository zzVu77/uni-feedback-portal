import axiosInstance from "@/config/axiosConfig";
import { OptionType } from "@/types";
export const getCategoryOptions = async (): Promise<OptionType[]> => {
  const response = await axiosInstance.get<{ id: string; name: string }[]>(
    "/categories/options",
  );
  return response.map((c) => ({ value: c.id, label: c.name }));
};
