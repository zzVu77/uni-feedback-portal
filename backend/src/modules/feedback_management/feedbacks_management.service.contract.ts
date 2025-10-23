import {
  FeedbackDetailDto,
  ForwardingResponseDto,
  ListFeedbacksResponseDto,
  CreateForwardingDto,
  UpdateFeedbackStatusDto,
  QueryFeedbackByStaffDto,
} from './dto';
import { FeedbackParamDto, QueryFeedbacksDto } from 'src/modules/feedbacks/dto';
export interface FeedbackManagementServiceContract {
  getAllStaffFeedbacks(
    query: QueryFeedbackByStaffDto,
    actor: {
      userId: number;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: number;
    },
  ): Promise<ListFeedbacksResponseDto>;
  getStaffFeedbackDetail(
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
  getAllFeedbacks(query: QueryFeedbacksDto): Promise<ListFeedbacksResponseDto>;
  getFeedbackDetail(params: FeedbackParamDto): Promise<FeedbackDetailDto>;
}
