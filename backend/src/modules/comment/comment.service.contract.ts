import {
  CommentDeletedResponseDto,
  CommentDto,
  CommentsResponseDto,
  CreateCommentDto,
  CreateCommentReportDto,
  QueryCommentsDto,
} from './dto/';
import { CommentReports } from '@prisma/client';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

export interface CommentServiceContract {
  // ===================== CREATE =====================
  createForumPostComment(
    dto: CreateCommentDto,
    postId: string,
    actor: ActiveUserData,
  ): Promise<CommentDto>;

  createAnnouncementComment(
    dto: CreateCommentDto,
    announcementId: string,
    actor: ActiveUserData,
  ): Promise<CommentDto>;

  // ===================== READ (GET) =====================
  getForumPostComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto>;

  getAnnouncementComments(
    announcementId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto>;

  // ===================== READ (COUNT) =====================
  countCommentsForPosts(postIds: string[]): Promise<Record<string, number>>;

  countCommentsForAnnouncements(
    announcementIds: string[],
  ): Promise<Record<string, number>>;

  // ===================== OTHER ACTIONS =====================
  createCommentReport(
    commentId: string,
    actor: ActiveUserData,
    dto: CreateCommentReportDto,
  ): Promise<CommentReports>;

  deleteComment(
    commentId: string,
    actor: ActiveUserData,
  ): Promise<CommentDeletedResponseDto>;
}
