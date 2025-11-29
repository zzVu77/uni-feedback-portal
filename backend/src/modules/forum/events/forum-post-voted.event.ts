export class ForumPostVotedEvent {
  postId: string;
  userId: string;

  constructor(partial: Partial<ForumPostVotedEvent>) {
    Object.assign(this, partial);
  }
}
