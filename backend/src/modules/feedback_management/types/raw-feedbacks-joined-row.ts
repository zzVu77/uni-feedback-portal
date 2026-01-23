import { Feedbacks } from '@prisma/client';

export type FeedbackBase = Feedbacks;
export type RawFeedbackJoinedRow = FeedbackBase & {
  departmentName: string;
  categoryName: string;

  studentId: string;
  studentFullName: string;
  studentEmail: string;

  // voteCount: number;
  // commentCount: number;
};
