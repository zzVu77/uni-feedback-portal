export type UserInfo = {
  id: string;
  fullName: string;
  role: "DEPARTMENT_STAFF" | "STUDENT" | "ADMIN";
  departmentId?: string;
};
