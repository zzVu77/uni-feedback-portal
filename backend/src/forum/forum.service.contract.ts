import { QueryPostsDto } from './dto/query-posts.dto';

export interface ForumServiceContract {
  listPosts(
    query: QueryPostsDto,
    actorId?: number,
  ): Promise<{
    items: Array<{
      post_id: number;
      feedback_id: number;
      subject: string;
      excerpt: string;
      category_id: number;
      department_id: number;
      votes: number;
      comments_count: number;
      created_at: string;
    }>;
    total: number;
  }>;
  getPost(
    post_id: number,
    actorId: number,
  ): Promise<{
    post_id: number;
    created_at: string;
    feedback: {
      feedback_id: number;
      subject: string;
      description: string;
      category_id: number;
      department_id: number;
    };
    votes: number;
    hasVoted: boolean;
    comments: Array<{
      comment_id: number;
      content: string;
      created_at: string;
      user: { user_id: number; full_name: string | null; role: string };
    }>;
  }>;
  vote(
    post_id: number,
    user_id: number,
  ): Promise<{ voted: true; votes: number }>;
  unvote(
    post_id: number,
    user_id: number,
  ): Promise<{ voted: false; votes: number }>;
}
