import axiosInstance from "@/config/axiosConfig";
import { OptionType } from "@/types";

const categoryBaseUrl = "/categories";

export const getCategoryOptions = async (): Promise<OptionType[]> => {
  const response = await axiosInstance.get<{ id: string; name: string }[]>(
    `${categoryBaseUrl}/options`,
  );
  return response.map((c) => ({ value: c.id, label: c.name }));
};
