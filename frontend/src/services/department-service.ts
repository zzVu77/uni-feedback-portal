import axiosInstance from "@/config/axiosConfig";
import {
  CreateDepartmentPayload,
  DepartmentDetail,
  DepartmentListResponse,
  DepartmentManagementFilter,
  OptionType,
  UpdateDepartmentPayload,
  UpdateDepartmentStatusPayload,
} from "@/types";

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

export const getDepartments = async (
  filter: DepartmentManagementFilter,
): Promise<DepartmentListResponse> => {
  const response = await axiosInstance.get<DepartmentListResponse>(
    departmentBaseUrl,
    { params: filter },
  );
  return response;
};

export const createDepartment = async (
  payload: CreateDepartmentPayload,
): Promise<DepartmentDetail> => {
  const response = await axiosInstance.post<DepartmentDetail>(
    departmentBaseUrl,
    payload,
  );
  return response;
};

export const updateDepartment = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateDepartmentPayload;
}): Promise<DepartmentDetail> => {
  const response = await axiosInstance.patch<DepartmentDetail>(
    `${departmentBaseUrl}/${id}`,
    payload,
  );
  return response;
};

export const updateDepartmentStatus = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateDepartmentStatusPayload;
}): Promise<DepartmentDetail> => {
  const response = await axiosInstance.patch<DepartmentDetail>(
    `${departmentBaseUrl}/${id}/status`,
    payload,
  );
  return response;
};
