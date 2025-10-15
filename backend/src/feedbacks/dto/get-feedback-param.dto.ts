import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { FeedbackSummary } from './query-my-feedbacks.dto';

export class GetFeedbackParamDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  feedback_id: number;
}
export class FeedbackDetail extends FeedbackSummary {
  description: string;
  statusHistory: Array<{
    status: string;
    message: string | null;
    createdAt: string;
  }>;
  forwardingLogs: Array<{
    forwardingLogId: number;
    fromDepartmentId: number;
    toDepartmentId: number;
    message: string | null;
    createdAt: string;
  }>;
  attachments: Array<{ id: number; fileName: string; fileUrl: string }>;
}
