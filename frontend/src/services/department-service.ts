import axiosInstance from "@/config/axiosConfig";
import { DepartmentOption } from "@/types/department";

export const getDepartmentOptions = async (): Promise<DepartmentOption[]> => {
  const response = await axiosInstance.get<{ id: string; name: string }[]>(
    "/departments/options",
  );
  return response.map((d) => ({ value: d.id, label: d.name }));
};
