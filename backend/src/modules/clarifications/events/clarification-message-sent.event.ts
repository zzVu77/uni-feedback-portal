export class ClarificationMessageSentEvent {
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;

  constructor(partial: Partial<ClarificationMessageSentEvent>) {
    Object.assign(this, partial);
  }
}
