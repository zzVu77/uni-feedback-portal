export type Department = {
  id: string;
  name: string;
  email: string;
  location: string;
};

export type UserInfo = {
  id: string;
  fullName: string;
  email: string;
  role: "DEPARTMENT_STAFF" | "STUDENT" | "ADMIN" | "STAFF_ASSISTANT";
  createdAt: string;
  department?: Department;
  avatarUrl?: string;
};
