import {
  CommentDto,
  CommentsResponseDto,
  CreateCommentDto,
  QueryCommentsDto,
  CreateCommentReportDto,
  CommentReportResponseDto,
  QueryCommentReportsDto,
  UpdateCommentReportDto,
} from './dto/';

export interface CommentServiceContract {
  createComment(dto: CreateCommentDto, userId: string): Promise<CommentDto>;
  getComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto>;

  createReport(
    commentId: string,
    userId: string,
    dto: CreateCommentReportDto,
  ): Promise<CommentReportResponseDto>;
  getReportDetail(id: string): Promise<CommentReportResponseDto>;
  getReports(
    query: QueryCommentReportsDto,
  ): Promise<{ results: CommentReportResponseDto[]; total: number }>;

  updateReport(
    id: string,
    dto: UpdateCommentReportDto,
  ): Promise<CommentReportResponseDto>;
}
