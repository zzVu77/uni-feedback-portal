import { CommentTargetType } from '@prisma/client';

export class CommentCreatedEvent {
  commentId: string;
  userId: string;
  content: string;
  targetId: string;
  targetType: CommentTargetType;
  parentId?: string | null;

  constructor(partial: Partial<CommentCreatedEvent>) {
    Object.assign(this, partial);
  }
}
