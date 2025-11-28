import { CommentTargetType } from '@prisma/client';

export class CommentCreatedEvent {
  commentId: string;
  userId: string; // Người viết comment
  content: string;
  targetId: string; // ID của Post hoặc Announcement
  targetType: CommentTargetType;
  parentId?: string | null; // Nếu có thì là reply

  constructor(partial: Partial<CommentCreatedEvent>) {
    Object.assign(this, partial);
  }
}
