import { FeedbackStatus } from '@prisma/client';
export function GenerateStatusUpdateMessage(
  departmentName: string,
  status: FeedbackStatus,
): string {
  switch (status) {
    case FeedbackStatus.PENDING:
      return `Phản hồi hiện đang chờ xử lý tại bộ phận ${departmentName}.`;

    case FeedbackStatus.IN_PROGRESS:
      return `Phản hồi đang được bộ phận ${departmentName} xử lý.`;

    case FeedbackStatus.RESOLVED:
      return `Phản hồi đã được bộ phận ${departmentName} giải quyết.`;

    case FeedbackStatus.REJECTED:
      return `Phản hồi đã bị bộ phận ${departmentName} từ chối.`;

    default:
      return `Trạng thái phản hồi đã được cập nhật tại bộ phận ${departmentName}.`;
  }
}
export function GenerateForwardingMessage(departmentName: string): string {
  return `Phản hồi đã được chuyển tiếp đến bộ phận ${departmentName} để xử lý tiếp.`;
}
