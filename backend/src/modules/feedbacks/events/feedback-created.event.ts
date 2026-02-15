// src/modules/feedbacks/events/feedback-created.event.ts

import is from "zod/v4/locales/is.js";

export class FeedbackCreatedEvent {
  feedbackId: string;
  userId: string;
  departmentId: string;
  subject: string;
  isToxic: boolean;

  constructor(partial: Partial<FeedbackCreatedEvent>) {
    Object.assign(this, partial);
  }
}
