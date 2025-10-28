import {
  CommentDto,
  CommentsResponseDto,
  CreateCommentDto,
  QueryCommentsDto,
  CreateCommentReportDto,
  CommentReportResponseDto,
  QueryCommentReportsDto,
  UpdateCommentReportDto,
  CommentReportDto,
} from './dto/';

export interface CommentServiceContract {
  createComment(
    dto: CreateCommentDto,
    postId: string,
    userId: string,
  ): Promise<CommentDto>;
  getComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto>;

  createReport(
    commentId: string,
    userId: string,
    dto: CreateCommentReportDto,
  ): Promise<CommentReportDto>;
  getReportDetail(commentReportId: string): Promise<CommentReportDto | null>;
  getReports(query: QueryCommentReportsDto): Promise<CommentReportResponseDto>;

  updateReport(
    id: string,
    dto: UpdateCommentReportDto,
  ): Promise<CommentReportDto>;
  deleteComment(commentId: string, userId?: string): Promise<CommentDto>;
}
