export class FeedbackForwardingEvent {
  feedback: {
    id: string;
    subject: string;
  };
  sender: {
    senderId: string;
    departmentName: string;
  };
  recipient: {
    departmentId: string;
    departmentName: string;
  };
  //   message: string;

  constructor(partial: Partial<FeedbackForwardingEvent>) {
    Object.assign(this, partial);
  }
}
