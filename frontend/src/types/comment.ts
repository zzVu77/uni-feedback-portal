export interface Comment {
  id: string;
  createdAt: string;
  content: string;
  user: {
    id: string;
    fullName: string;
    role: "STUDENT" | "STAFF";
  };
  replies: Comment[];
}
