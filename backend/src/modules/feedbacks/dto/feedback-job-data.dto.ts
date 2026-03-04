import { CreateFeedbackDto } from "./create-feedback.dto";
import type { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';
import { UpdateFeedbackDto } from "./update-feedback.dto";
export type FeedbackJobData = | {
    type: 'create';
    dto: CreateFeedbackDto;
    actor: ActiveUserData;
}|{
    type: 'update';
    feedbackId: string;
    updateFileAttachments: any,
    updateData: any,
    dto: UpdateFeedbackDto;
    actor: ActiveUserData;
}