export class ClarificationEvent {
  conversationId: string;
  studentId: string;
  subject: string;
  feedbackId: string;

  constructor(partial: Partial<ClarificationEvent>) {
    Object.assign(this, partial);
  }
}
