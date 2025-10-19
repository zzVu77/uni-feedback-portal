import { QueryManageFeedbacksDto } from './dto/query-manage-feedbacks.dto';
import { UpdateFeedbackStatusDto } from './dto/update-feedback-status.dto';
import { CreateForwardingDto } from './dto/create-forwarding.dto';
import { FeedbackSummary, FeedbackDetail } from '../feedbacks/dto/';
export interface FeedbackManagementServiceContract {
  list(
    query: QueryManageFeedbacksDto,
    actor: {
      user_id: number;
      role: 'DepartmentStaff' | 'Admin';
      department_id: number;
    },
  ): Promise<{
    items: (FeedbackSummary & {
      student?: { user_id: number; full_name: string | null; email: string };
    })[];
    total: number;
  }>;
  getDetail(
    feedback_id: number,
    actor: {
      user_id: number;
      role: 'DepartmentStaff' | 'Admin';
      department_id: number;
    },
  ): Promise<FeedbackDetail & { forum_post?: { post_id: number } }>;
  updateStatus(
    feedback_id: number,
    dto: UpdateFeedbackStatusDto,
    actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  ): Promise<{
    feedback_id: number;
    current_status: string;
    updated_at: string;
  }>;
  createForwarding(
    feedback_id: number,
    dto: CreateForwardingDto,
    actor: { user_id: number; from_department_id: number },
  ): Promise<{
    forwarding_log_id: number;
    feedback_id: number;
    from_department_id: number;
    to_department_id: number;
    created_at: string;
  }>;
}
