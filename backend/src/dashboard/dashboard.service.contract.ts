import { DashboardFeedbacksDto } from './dto/dashboard-feedbacks.dto';

export interface DashboardServiceContract {
  getFeedbacksOverview(
    dto: DashboardFeedbacksDto,
    actor: { role: 'DepartmentStaff' | 'Admin'; department_id: number },
  ): Promise<{
    totals: {
      all: number;
      PENDING: number;
      IN_PROGRESS: number;
      RESOLVED: number;
      REJECTED: number;
    };
    byCategory: Array<{ category_id: number; count: number }>;
    trend: Array<{ date: string; count: number }>;
  }>;
}
