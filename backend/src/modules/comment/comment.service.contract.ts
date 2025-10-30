import { CommentReportDto } from '../moderation/dto';
import {
  CommentDto,
  CommentsResponseDto,
  CreateCommentDto,
  QueryCommentsDto,
  CreateCommentReportDto,
} from './dto/';

export interface CommentServiceContract {
  CreateComment(
    dto: CreateCommentDto,
    postId: string,
    userId: string,
  ): Promise<CommentDto>;
  GetComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto>;

  CreateCommentReport(
    commentId: string,
    userId: string,
    dto: CreateCommentReportDto,
  ): Promise<CommentReportDto>;
  DeleteComment(
    commentId: string,
    actor: {
      role: 'STUDENT' | 'ADMIN';
      id: string;
    },
  ): Promise<CommentDto>;
}
