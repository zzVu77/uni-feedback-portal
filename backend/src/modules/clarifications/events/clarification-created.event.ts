export class ClarificationCreatedEvent {
  conversationId: string;
  studentId: string;
  subject: string;

  constructor(partial: Partial<ClarificationCreatedEvent>) {
    Object.assign(this, partial);
  }
}
