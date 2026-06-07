export enum UserRole {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  DEPARTMENT_STAFF = "DEPARTMENT_STAFF",
  STAFF_ASSISTANT = "STAFF_ASSISTANT",
  SUPERADMIN = "SUPERADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  DEACTIVATED = "DEACTIVATED",
  BANNED = "BANNED",
  PERMANENTLY_DELETED = "PERMANENTLY_DELETED",
}

export interface DepartmentInfo {
  id: string;
  name: string;
  email?: string;
  location?: string | null;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  deactivatedUntil?: string | null;
  department?: DepartmentInfo;
  createdAt: string;
  avatarUrl?: string;
  violationCount?: number;
}

export interface UserListResponse {
  results: UserResponse[];
  total: number;
}

export enum UserOrderBy {
  VIOLATION_COUNT_DESC = "violationCount_desc",
  VIOLATION_COUNT_ASC = "violationCount_asc",
  CREATED_AT_DESC = "createdAt_desc",
}

export interface UserManagementFilter {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | UserRole[];
  status?: UserStatus;
  departmentId?: string;
  lookbackDays?: number;
  orderBy?: UserOrderBy;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  departmentId?: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  departmentId?: string | null;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
  durationDays?: number;
}

export interface UserViolation {
  id: string;
  commentId: string;
  reporterId: string;
  reason: string;
  decision: string;
  createdAt: string;
  updatedAt: string;
  comment: {
    id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: string;
  };
}

export interface UserViolationsResponse {
  results: UserViolation[];
  total: number;
}

export interface UserViolationsFilter {
  page?: number;
  limit?: number;
  lookbackDays?: number;
}
