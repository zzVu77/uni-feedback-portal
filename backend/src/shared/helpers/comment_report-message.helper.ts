import { ReportStatus } from '@prisma/client';

export function GenerateAdminResponse(
  status: ReportStatus,
  isDeleted: boolean,
): string {
  switch (status) {
    case ReportStatus.RESOLVED:
      return isDeleted
        ? 'The reported comment has been reviewed and removed.'
        : 'The reported comment has been reviewed and found not to violate guidelines.';
    case ReportStatus.PENDING:
      return 'The report is pending review by the administration.';
    default:
      return 'System notice: report status updated.';
  }
}
