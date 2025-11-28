import axiosInstance from "@/config/axiosConfig";
import { DepartmentDetail, OptionType } from "@/types";

const departmentBaseUrl = "/departments";
export const getDepartmentOptions = async (): Promise<OptionType[]> => {
  const response = await axiosInstance.get<{ id: string; name: string }[]>(
    `${departmentBaseUrl}/options`,
  );
  return response.map((d) => ({ value: d.id, label: d.name }));
};
export const getDepartmentDetailInfo = async (
  departmentId: string,
): Promise<DepartmentDetail> => {
  const response = await axiosInstance.get<DepartmentDetail>(
    `${departmentBaseUrl}/${departmentId}`,
  );
  return response;
};
