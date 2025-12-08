import { FeedbackStatus } from '@prisma/client';
export function GenerateStatusUpdateMessage(
  departmentName: string,
  status: FeedbackStatus,
): string {
  switch (status) {
    case FeedbackStatus.PENDING:
      return `Cảm ơn bạn đã gửi phản góp ý đến bộ phận ${departmentName}. Chúng tôi sẽ cố gắng xử lý góp ý của bạn trong thời gian sớm nhất.`;

    case FeedbackStatus.IN_PROGRESS:
      return `Góp ý đang được bộ phận ${departmentName} xử lý.`;

    case FeedbackStatus.RESOLVED:
      return `Góp ý đã được bộ phận ${departmentName} giải quyết.`;

    case FeedbackStatus.REJECTED:
      return `Góp ý đã bị bộ phận ${departmentName} từ chối.`;

    default:
      return `Trạng thái Góp ý đã được cập nhật tại bộ phận ${departmentName}.`;
  }
}
export function GenerateForwardingMessage(departmentName: string): string {
  return `Góp ý đã được chuyển tiếp đến bộ phận ${departmentName} để xử lý tiếp.`;
}
