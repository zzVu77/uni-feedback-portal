export class ClarificationCreatedEvent {
  conversationId: string;
  studentId: string;
  subject: string;
  feedbackId: string;

  constructor(partial: Partial<ClarificationCreatedEvent>) {
    Object.assign(this, partial);
  }
}
