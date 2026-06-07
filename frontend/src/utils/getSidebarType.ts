export function getSidebarType(
  role:
    | "STUDENT"
    | "DEPARTMENT_STAFF"
    | "ADMIN"
    | "STAFF_ASSISTANT"
    | undefined,
): "student" | "staff" | "admin" | "staff-assistant" {
  switch (role) {
    case "STUDENT":
      return "student";
    case "DEPARTMENT_STAFF":
      return "staff";
    case "STAFF_ASSISTANT":
      return "staff-assistant";
    case "ADMIN":
      return "admin";
    default:
      return "student";
  }
}
