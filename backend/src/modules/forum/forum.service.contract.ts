import { GetPostsResponseDto, QueryPostsDto, PostDetailDto } from './dto';
export interface ForumServiceContract {
  getListPosts(
    query: QueryPostsDto,
    actorId?: number,
  ): Promise<GetPostsResponseDto>;
  getPostDetail(post_id: number, actorId: number): Promise<PostDetailDto>;
  vote(
    post_id: number,
    user_id: number,
  ): Promise<{ voted: true; votes: number }>;
  unvote(
    post_id: number,
    user_id: number,
  ): Promise<{ voted: false; votes: number }>;
}
