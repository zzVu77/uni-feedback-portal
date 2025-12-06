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
  role: "DEPARTMENT_STAFF" | "STUDENT" | "ADMIN";
  createdAt: string;
  department?: Department;
};
