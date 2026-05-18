import { useMutation } from "@tanstack/react-query";
import { getDepartmentProposal } from "@/services/ai-service";
import { DepartmentProposalPayload } from "@/types";

export const useGetDepartmentProposal = () => {
  return useMutation({
    mutationFn: (payload: DepartmentProposalPayload) =>
      getDepartmentProposal(payload),
  });
};
