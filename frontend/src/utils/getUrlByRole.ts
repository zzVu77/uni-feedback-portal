export const getUrlByRole = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "STUDENT":
      return "/student";
    case "DEPARTMENT_STAFF":
      return "/staff";
    case "STAFF_ASSISTANT":
      return "/staff-assistant";
    default:
      return "/";
  }
};
