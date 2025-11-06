import { ReportStatus } from '@prisma/client';

export function GenerateAdminResponse(status: ReportStatus): string {
  switch (status) {
    case ReportStatus.RESOLVED:
      return 'The reported comment has been reviewed and appropriate action was taken.';
    case ReportStatus.PENDING:
      return 'The report is pending review by the administration.';
    default:
      return 'System notice: report status updated.';
  }
}
