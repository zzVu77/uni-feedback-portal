export interface Comment {
  id: string;
  createdAt: string;
  content: string;
  user: {
    id: string;
    fullName: string;
    role: "STUDENT" | "DEPARTMENT_STAFF" | "ADMIN";
  };
  replies: Comment[];
}

export type CommentPayload = {
  content: string;
  parentId?: string;
};
