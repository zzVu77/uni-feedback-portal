import { QueryManageFeedbacksDto } from './dto/query-manage-feedbacks.dto';
import { UpdateFeedbackStatusDto } from './dto/update-feedback-status.dto';
import { CreateForwardingDto } from './dto/create-forwarding.dto';
import {
  FeedbackDetailDto,
  ListFeedbacksResponseDto,
} from './dto/feedback_management_response.dto';
import { FeedbackParamDto } from 'src/feedbacks/dto';
export interface FeedbackManagementServiceContract {
  getAllFeedbacks(
    query: QueryManageFeedbacksDto,
    actor: {
      userId: number;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: number;
    },
  ): Promise<ListFeedbacksResponseDto>;
  getFeedbackDetail(
    params: FeedbackParamDto,
    actor: {
      userId: number;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: number;
    },
  ): Promise<FeedbackDetailDto>;
  updateStatus(
    FeedbackParamDto: { feedbackId: number },
    dto: UpdateFeedbackStatusDto,
    actor: { userId: number; role: 'DEPARTMENT_STAFF' | 'ADMIN' },
  ): Promise<UpdateFeedbackStatusDto>;
  createForwarding(
    feedbackId: number,
    dto: CreateForwardingDto,
    actor: { userId: number; fromDepartmentId: number },
  ): Promise<{
    forwarding_log_id: number;
    feedback_id: number;
    from_department_id: number;
    to_department_id: number;
    created_at: string;
  }>;
}
