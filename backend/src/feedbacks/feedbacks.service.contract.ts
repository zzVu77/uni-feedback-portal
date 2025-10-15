import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { SearchMyFeedbacksDto } from './dto/search-my-feedbacks.dto';
import {
  QueryMyFeedbacksDto,
  GetMyFeedbacksResponseDto,
  FeedbackSummary,
  GetFeedbackParamDto,
  GetFeedbackDetailResponse,
} from './dto';
export interface FeedbacksServiceContract {
  createFeedback(
    dto: CreateFeedbackDto,
    userId: number,
  ): Promise<FeedbackSummary>;
  getMyFeedbacks(
    query: QueryMyFeedbacksDto,
    userId: number,
  ): Promise<GetMyFeedbacksResponseDto>;
  getFeedbackDetail(
    params: GetFeedbackParamDto,
    actor: {
      userId: number;
      role: 'STUDENT' | 'DEPARTMENTSTAFF' | 'ADMIN';
      departmentId?: number;
    },
  ): Promise<GetFeedbackDetailResponse>;
  searchMyFeedbacks(
    query: SearchMyFeedbacksDto,
    userId: number,
  ): Promise<{
    items: Array<{
      feedback_id: number;
      subject: string;
      current_status: string;
      created_at: string;
    }>;
    total: number;
  }>;
}
