import type { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';
import { UpdateFeedbackDto } from "./update-feedback.dto";
export type FeedbackJobData = | {
    type: 'create';
    feedback:any;
    actor: ActiveUserData;
}|{
    type: 'update';
    feedbackId: string;
    updateData: any,
    dto: UpdateFeedbackDto;
    actor: ActiveUserData;
}