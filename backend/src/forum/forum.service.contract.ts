import { CreateCommentDto } from './dto/create-comment.dto';
import { GetPostResponseDto } from './dto/get-post-param-response.dto';
import { QueryCommentsDto } from './dto/query-comments.dto';
import { QueryPostsResponseDto } from './dto/query-posts-response.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
export interface ForumServiceContract {
  listPosts(
    query: QueryPostsDto,
    actorId?: number,
  ): Promise<QueryPostsResponseDto>;
  getPost(post_id: number, actorId: number): Promise<GetPostResponseDto>;
  vote(
    post_id: number,
    user_id: number,
  ): Promise<{ voted: true; votes: number }>;
  unvote(
    post_id: number,
    user_id: number,
  ): Promise<{ voted: false; votes: number }>;
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
