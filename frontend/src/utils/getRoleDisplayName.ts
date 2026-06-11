export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    student: "Sinh viên",
    staff: "Nhân viên phòng ban",
    staff_assistant: "Cộng tác viên",
    admin: "Quản trị viên",
  };
  return roleMap[role] || "";
};
