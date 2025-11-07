import { CreateFeedbackDto } from './dto/create-feedback.dto';
import {
  QueryFeedbacksDto,
  GetMyFeedbacksResponseDto,
  FeedbackSummary,
  FeedbackParamDto,
  FeedbackDetail,
} from './dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
export interface FeedbacksServiceContract {
  createFeedback(
    dto: CreateFeedbackDto,
    userId: number,
  ): Promise<FeedbackSummary>;
  getMyFeedbacks(
    query: QueryFeedbacksDto,
    userId: number,
  ): Promise<GetMyFeedbacksResponseDto>;
  getFeedbackDetail(
    params: FeedbackParamDto,
    actor: {
      userId: number;
      role: 'STUDENT' | 'DEPARTMENTSTAFF' | 'ADMIN';
      departmentId?: number;
    },
  ): Promise<FeedbackDetail>;
  updateFeedback(
    params: FeedbackParamDto,
    dto: UpdateFeedbackDto,
    userId: string,
  ): Promise<FeedbackDetail>;
  deleteFeedback(params: FeedbackParamDto, userId: string): Promise<void>;
}
