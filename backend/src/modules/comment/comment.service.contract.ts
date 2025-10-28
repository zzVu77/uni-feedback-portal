import {
  CommentDto,
  CommentsResponseDto,
  CreateCommentDto,
  QueryCommentsDto,
} from './dto/';

export interface CommentServiceContract {
  createComment(dto: CreateCommentDto, userId: string): Promise<CommentDto>;
  listComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto>;
}
