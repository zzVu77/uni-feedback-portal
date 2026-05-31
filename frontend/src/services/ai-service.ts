import axiosInstance from "@/config/axiosConfig";
import { DepartmentProposalPayload, DepartmentResponse } from "@/types";

const aiBaseUrl = "/ai";

export const getDepartmentProposal = async (
  payload: DepartmentProposalPayload,
): Promise<DepartmentResponse> => {
  const response = await axiosInstance.post<DepartmentResponse>(
    `${aiBaseUrl}/department-proposal`,
    payload,
  );
  return response;
};
