import {
  ForwardingResponseDto,
  CreateForwardingDto,
  UpdateFeedbackStatusDto,
} from './dto';
export interface FeedbackManagementServiceContract {
  updateStatus(
    FeedbackParamDto: { feedbackId: number },
    dto: UpdateFeedbackStatusDto,
    actor: { userId: number; role: 'DEPARTMENT_STAFF' | 'ADMIN' },
  ): Promise<UpdateFeedbackStatusDto>;
  createForwarding(
    feedbackId: number,
    dto: CreateForwardingDto,
    actor: { userId: number; fromDepartmentId: number },
  ): Promise<ForwardingResponseDto>;
}
