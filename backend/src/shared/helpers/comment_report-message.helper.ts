import { ReportStatus } from '@prisma/client';

export function GenerateAdminResponse(
  status: ReportStatus,
  isDeleted: boolean,
): string {
  switch (status) {
    case ReportStatus.RESOLVED:
      return isDeleted
        ? 'Bình luận bị báo cáo đã được xem xét và xóa.'
        : 'Bình luận bị báo cáo đã được xem xét và không phát hiện vi phạm.';
    case ReportStatus.PENDING:
      return 'Báo cáo đang chờ được xem xét bởi quản trị viên.';
    default:
      return 'Thông báo hệ thống: trạng thái báo cáo đã được cập nhật.';
  }
}
