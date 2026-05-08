export interface DepartmentAI {
  id: string;
  name: string;
  reason: string;
}

export interface DepartmentResponse {
  departments: DepartmentAI[];
}

export interface DepartmentProposalPayload {
  description: string;
}
