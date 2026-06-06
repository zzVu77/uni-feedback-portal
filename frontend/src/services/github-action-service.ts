/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/config/axiosConfig";

export interface TriggerGithubActionPayload {
  owner: string;
  repo: string;
  workflowId: string;
  ref: string;
  inputs?: Record<string, any>;
}

export const triggerGithubAction = async (
  payload: TriggerGithubActionPayload,
) => {
  const response = await axiosInstance.post("/github-action/trigger", payload);
  return response;
};
