export class CommentReportCreatedEvent {
  reportId: string;
  commentId: string;
  reporterId: string;
  reason?: string;
  targetId: string;
  targetType: string;
  constructor(partial: Partial<CommentReportCreatedEvent>) {
    Object.assign(this, partial);
  }
}
