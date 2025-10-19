import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { SearchMyFeedbacksDto } from './dto/search-my-feedbacks.dto';
import {
  QueryFeedbacksDto,
  GetMyFeedbacksResponseDto,
  FeedbackSummary,
  FeedbackParamDto,
  FeedbackDetail,
} from './dto';
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
  searchMyFeedbacks(
    query: SearchMyFeedbacksDto,
    userId: number,
  ): Promise<GetMyFeedbacksResponseDto>;
}
