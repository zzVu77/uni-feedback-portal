// src/modules/feedbacks/events/feedback-created.event.ts

export class FeedbackCreatedEvent {
  feedbackId: string;
  userId: string;
  departmentId: string;
  subject: string;

  constructor(partial: Partial<FeedbackCreatedEvent>) {
    Object.assign(this, partial);
  }
}
