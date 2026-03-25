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
    case FeedbackStatus.VIOLATED_CONTENT:
      return `Góp ý của bạn đã bị từ chối vì chứa nội dung vi phạm. Vui lòng chỉnh sửa và gửi lại.`;
    case FeedbackStatus.AI_REVIEWING:
      return `Góp ý của bạn đang được hệ thống kiểm duyệt nội dung tự động đánh giá. Vui lòng chờ trong giây lát.`;
    case FeedbackStatus.AI_REVIEW_FAILED:
      return `Hệ thống đang gặp sự cố khi đánh giá nội dung của góp ý. Vui lòng thử lại sau.`;
    default:
      return `Trạng thái Góp ý đã được cập nhật tại bộ phận ${departmentName}.`;
  }
}
export function GenerateForwardingMessage(departmentName: string): string {
  return `Góp ý đã được chuyển tiếp đến bộ phận ${departmentName} để xử lý tiếp.`;
}
