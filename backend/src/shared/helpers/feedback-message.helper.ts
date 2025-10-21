import { FeedbackStatus } from '@prisma/client';

/**
 * Generate a message when updating feedback status
 * @param departmentName - The name of the department handling the feedback
 * @param status - The new feedback status
 * @returns A descriptive message about the status update
 */
export function generateStatusUpdateMessage(
  departmentName: string,
  status: FeedbackStatus,
): string {
  switch (status) {
    case FeedbackStatus.PENDING:
      return `The feedback is currently pending in the ${departmentName} department.`;

    case FeedbackStatus.IN_PROGRESS:
      return `The feedback is being processed by the ${departmentName} department.`;

    case FeedbackStatus.RESOLVED:
      return `The feedback has been resolved by the ${departmentName} department.`;

    case FeedbackStatus.REJECTED:
      return `The feedback has been rejected by the ${departmentName} department.`;

    default:
      return `The feedback status has been updated in the ${departmentName} department.`;
  }
}

/**
 * Generate a message when forwarding feedback to another department
 * @param departmentName - The name of the department the feedback is forwarded to
 * @returns A descriptive message about the forwarding action
 */
export function generateForwardingMessage(departmentName: string): string {
  return `The feedback has been forwarded to the ${departmentName} department for further processing.`;
}
