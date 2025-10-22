import { QueryCommentReportsDto } from './dto/query-comment-reports.dto';
import { UpdateCommentReportDto } from './dto/update-comment-report.dto';

export interface ModerationServiceContract {
  listReports(
    query: QueryCommentReportsDto,
    actor: { role: 'Admin'; user_id: number },
  ): Promise<{
    items: Array<{
      comment_report_id: number;
      comment_id: number;
      user_id: number;
      reason: string | null;
      status: string;
      admin_response?: string | null;
      created_at: string;
    }>;
    total: number;
  }>;
  getReport(
    comment_report_id: number,
    actor: { role: 'Admin'; user_id: number },
  ): Promise<{
    comment_report_id: number;
    comment: {
      comment_id: number;
      content: string;
      created_at: string;
      user: { user_id: number; full_name: string | null; role: string };
    };
    reporter: { user_id: number; full_name: string | null };
    reason: string | null;
    status: string;
    admin_response?: string | null;
    created_at: string;
  }>;
  updateReport(
    comment_report_id: number,
    dto: UpdateCommentReportDto,
    actor: { role: 'Admin'; user_id: number },
  ): Promise<{
    comment_report_id: number;
    status: string;
    admin_response?: string;
  }>;
  deleteComment(
    comment_id: number,
    actor: { role: 'Admin'; user_id: number },
    admin_response?: string,
  ): Promise<{ success: true }>;
}
