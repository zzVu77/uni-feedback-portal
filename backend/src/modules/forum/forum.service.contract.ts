import {
  GetPostsResponseDto,
  QueryPostsDto,
  PostDetailDto,
  VoteResponseDto,
} from './dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

export interface ForumServiceContract {
  getListPosts(
    query: QueryPostsDto,
    actor: ActiveUserData,
  ): Promise<GetPostsResponseDto>;
  getPostDetail(postId: string, actor: ActiveUserData): Promise<PostDetailDto>;
  vote(postId: string, actor: ActiveUserData): Promise<VoteResponseDto>;
  unvote(postId: string, actor: ActiveUserData): Promise<VoteResponseDto>;
}
