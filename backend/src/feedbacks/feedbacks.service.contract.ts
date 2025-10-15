import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { SearchMyFeedbacksDto } from './dto/search-my-feedbacks.dto';
import {
  QueryMyFeedbacksDto,
  GetMyFeedbacksResponseDto,
  FeedbackSummary,
} from './dto/query-my-feedbacks.dto';

export interface FeedbackDetail extends FeedbackSummary {
  description: string;
  department: { department_id: number; department_name: string };
  category: { category_id: number; category_name: string };
  status_history: Array<{
    status: string;
    message: string | null;
    created_at: string;
  }>;
  forwarding_logs: Array<{
    forwarding_log_id: number;
    from_department_id: number;
    to_department_id: number;
    message: string | null;
    created_at: string;
  }>;
  attachments: Array<{ id: number; file_name: string; file_url: string }>;
}

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
    feedback_id: number,
    actor: {
      user_id: number;
      role: 'Student' | 'DepartmentStaff' | 'Admin';
      department_id: number;
    },
  ): Promise<FeedbackDetail>;
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
