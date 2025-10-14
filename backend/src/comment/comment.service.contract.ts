import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentsDto } from './dto/query-comments.dto';

export interface CommentServiceContract {
  createComment(
    dto: CreateCommentDto,
    user_id: number,
  ): Promise<{
    comment_id: number;
    post_id: number;
    content: string;
    created_at: string;
    user: { user_id: number; full_name: string | null; role: string };
  }>;
  listComments(
    post_id: number,
    query: QueryCommentsDto,
  ): Promise<{
    items: Array<{
      comment_id: number;
      content: string;
      created_at: string;
      user: { user_id: number; full_name: string | null; role: string };
    }>;
    total: number;
  }>;
}
