import {
  CommentDeletedResponseDto,
  CommentDto,
  CommentsResponseDto,
  CreateCommentDto,
  CreateCommentReportDto,
  QueryCommentsDto,
} from './dto/';
import { CommentReports, UserRole } from '@prisma/client';

export interface CommentServiceContract {
  // ===================== CREATE =====================
  CreateForumPostComment(
    dto: CreateCommentDto,
    postId: string,
    userId: string,
  ): Promise<CommentDto>;

  CreateAnnouncementComment(
    dto: CreateCommentDto,
    announcementId: string,
    userId: string,
  ): Promise<CommentDto>;

  // ===================== READ (GET) =====================
  GetForumPostComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto>;

  GetAnnouncementComments(
    announcementId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto>;

  // ===================== READ (COUNT) =====================
  countCommentsForPosts(postIds: string[]): Promise<Record<string, number>>;

  countCommentsForAnnouncements(
    announcementIds: string[],
  ): Promise<Record<string, number>>;

  // ===================== OTHER ACTIONS =====================
  CreateCommentReport(
    commentId: string,
    userId: string,
    dto: CreateCommentReportDto,
  ): Promise<CommentReports>;

  DeleteComment(
    commentId: string,
    actor: {
      id: string;
      role: UserRole;
    },
  ): Promise<CommentDeletedResponseDto>;
}
