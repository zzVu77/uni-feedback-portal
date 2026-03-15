import type { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';
import { FeedbackDetail } from './feedback-response.dto';
import { UpdateFeedbackDto } from "./update-feedback.dto";
export type FeedbackJobData = | {
    type: 'create';
    feedback:FeedbackDetail;
    actor: ActiveUserData;
}|{
    type: 'update';
    feedbackId: string;
    updateData: UpdateFeedbackDto,
    actor: ActiveUserData;
}