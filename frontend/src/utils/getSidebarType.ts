export function getSidebarType(
  role: "STUDENT" | "DEPARTMENT_STAFF" | "ADMIN" | undefined,
): "student" | "staff" | "admin" {
  switch (role) {
    case "STUDENT":
      return "student";
    case "DEPARTMENT_STAFF":
      return "staff";
    case "ADMIN":
      return "admin";
    default:
      return "student";
  }
}
