import { GetPostsResponseDto, QueryPostsDto, PostResponseDto } from './dto';
export interface ForumServiceContract {
  getListPosts(
    query: QueryPostsDto,
    actorId?: number,
  ): Promise<GetPostsResponseDto>;
  getPostDetail(post_id: number, actorId: number): Promise<PostResponseDto>;
  vote(
    post_id: number,
    user_id: number,
  ): Promise<{ voted: true; votes: number }>;
  unvote(
    post_id: number,
    user_id: number,
  ): Promise<{ voted: false; votes: number }>;
}
