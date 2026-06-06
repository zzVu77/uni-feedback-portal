/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import {
  triggerGithubAction,
  TriggerGithubActionPayload,
} from "@/services/github-action-service";
import { toast } from "sonner";

export const useTriggerGithubAction = () => {
  return useMutation({
    mutationFn: (payload: TriggerGithubActionPayload) =>
      triggerGithubAction(payload),
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi kích hoạt Pipeline!",
      );
    },
  });
};
