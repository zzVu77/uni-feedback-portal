export type DepartmentDetail = {
  id: string;
  name: string;
  email: string;
  description?: string;
  location?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  feedbackCount: number;
};

export interface DepartmentListResponse {
  results: DepartmentDetail[];
  total: number;
}

export interface DepartmentManagementFilter {
  page?: number;
  pageSize?: number;
  q?: string;
  isActive?: boolean | string;
}

export interface CreateDepartmentPayload {
  name: string;
  email: string;
  description?: string;
  location?: string;
  phone?: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  email?: string;
  description?: string;
  location?: string;
  phone?: string;
}

export interface UpdateDepartmentStatusPayload {
  isActive: boolean;
}
