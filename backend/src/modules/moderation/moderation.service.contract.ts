import {
  CommentReportDto,
  CommentReportResponseDto,
  QueryCommentReportsDto,
  UpdateCommentReportDto,
} from './dto';

export interface ModerationServiceContract {
  getCommentReportDetail(
    commentReportId: string,
    actor: { role: 'ADMIN'; id: string },
  ): Promise<CommentReportDto>;
  getCommentReports(
    query: QueryCommentReportsDto,
    actor: { role: 'ADMIN'; id: string },
  ): Promise<CommentReportResponseDto>;
  updateCommentReport(
    id: string,
    actor: { role: 'ADMIN'; id: string },
    dto: UpdateCommentReportDto,
  ): Promise<CommentReportDto>;
}
