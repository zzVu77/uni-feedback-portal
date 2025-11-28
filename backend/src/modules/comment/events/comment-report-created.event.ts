export class CommentReportCreatedEvent {
  reportId: string;
  commentId: string;
  reporterId: string;
  reason?: string;

  constructor(partial: Partial<CommentReportCreatedEvent>) {
    Object.assign(this, partial);
  }
}
