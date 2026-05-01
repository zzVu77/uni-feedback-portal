export type DepartmentAI = {
  id: string;
  name: string;
  reason: string;
};

export type DepartmentResponse = {
  departments: DepartmentAI[];
};
export type DepartmentCandidate = {
  id: string;
  name: string;
  description: string | null | undefined;
};
export function safeParseJSON(text: string): DepartmentResponse {
  try {
    return JSON.parse(text) as DepartmentResponse;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as DepartmentResponse;
    }
    return { departments: [] };
  }
}
