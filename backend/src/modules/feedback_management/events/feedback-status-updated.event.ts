import { FeedbackStatus } from '@prisma/client';

export class FeedbackStatusUpdatedEvent {
  feedbackId: string;
  userId: string;
  subject: string;
  status: FeedbackStatus;

  constructor(partial: Partial<FeedbackStatusUpdatedEvent>) {
    Object.assign(this, partial);
  }
}
