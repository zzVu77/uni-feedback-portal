import {
  FeedbackDetailDto,
  ForwardingResponseDto,
  ListFeedbacksResponseDto,
  CreateForwardingDto,
  UpdateFeedbackStatusDto,
} from './dto';
import { FeedbackParamDto, QueryFeedbacksDto } from 'src/modules/feedbacks/dto';
export interface FeedbackManagementServiceContract {
  getAllFeedbacks(
    query: QueryFeedbacksDto,
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
  ): Promise<ForwardingResponseDto>;
}
