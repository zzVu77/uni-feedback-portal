import { FeedbackStatus } from '@prisma/client';
import {
  ExtendedStatus,
  UnifiedStatusTimeline,
} from 'src/modules/feedbacks/dto/feedback-response.dto';

export function mergeStatusAndForwardLogs(params: {
  statusHistory: Array<{
    status: FeedbackStatus;
    message: string;
    note: string | null;
    createdAt: Date;
  }>;
  forwardingLogs: Array<{
    fromDept: { name: string };
    toDept: { name: string };
    message: string;
    note: string | null;
    createdAt: Date;
  }>;
}): UnifiedStatusTimeline {
  const { statusHistory, forwardingLogs } = params;

  const normalizedStatus = statusHistory.map((s) => ({
    status: s.status as ExtendedStatus,
    message: s.message,
    note: s.note,
    createdAt: s.createdAt.toISOString(),
  }));

  const normalizedForward = forwardingLogs.map((f) => ({
    status: 'FORWARDED' as ExtendedStatus,
    message: f.message,
    note: f.note,
    createdAt: f.createdAt.toISOString(),
  }));

  return [...normalizedStatus, ...normalizedForward].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}
