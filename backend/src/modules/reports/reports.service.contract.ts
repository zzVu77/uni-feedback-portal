import { ExportFeedbacksDto } from './dto/export-feedbacks.dto';

export interface ReportsServiceContract {
  exportFeedbacks(
    dto: ExportFeedbacksDto,
    actor: { role: 'DepartmentStaff' | 'Admin'; department_id: number },
  ): Promise<{ filename: string; mime: string; data: Buffer }>;
}
