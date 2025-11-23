import {
  CommentReportDto,
  CommentReportResponseDto,
  QueryCommentReportsDto,
  UpdateCommentReportDto,
} from './dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

export interface ModerationServiceContract {
  getCommentReportDetail(
    commentReportId: string,
    actor: ActiveUserData,
  ): Promise<CommentReportDto>;
  getCommentReports(
    query: QueryCommentReportsDto,
    actor: ActiveUserData,
  ): Promise<CommentReportResponseDto>;
  updateCommentReport(
    id: string,
    dto: UpdateCommentReportDto,
    actor: ActiveUserData,
  ): Promise<CommentReportDto>;
}
