import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AiService } from '../ai/ai.service';
import {
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ForumService } from '../forum/forum.service';
import { UploadsService } from '../uploads/uploads.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedbackCreatedEvent } from './events/feedback-created.event';
import { GenerateStatusUpdateMessage } from 'src/shared/helpers/feedback-message.helper';
import { FileTargetType } from '@prisma/client';
import {
  FeedbackSummary
}   from './dto';
@Processor('feedback-toxic')
export class FeedbackToxicProcessor extends WorkerHost {
    constructor(
        private readonly aiService: AiService,
        private readonly prisma: PrismaService,
        private readonly forumService: ForumService,
        private readonly uploadsService: UploadsService,
        private readonly eventEmitter: EventEmitter2,
    ) {
        super();
    }
    async process(job: Job): Promise<FeedbackSummary> {
        const { dto, actor } = job.data;
        const { fileAttachments, ...feedbackData } = dto;
        const isToxic = await this.aiService.checkToxicity(dto.description);
        if (isToxic) {
            throw new ForbiddenException(
                'Feedback description contains toxic content. Please modify and try again.',
            );
        }
        else{
           // Create new feedback
            const feedback = await this.prisma.feedbacks.create({
            data: {
                subject: feedbackData.subject,
                description: feedbackData.description,
                location: feedbackData.location,
                isPrivate: dto.isAnonymous ? true : false,
                departmentId: feedbackData.departmentId,
                categoryId: feedbackData.categoryId,
                userId: actor.sub,
            },
            include: {
                department: true,
                category: true,
            },
            });
            if (dto.isPublic) {
            await this.forumService.createForumPost(feedback.id, actor);
            }

            // Create attachments using UploadsService
            if (fileAttachments && fileAttachments.length > 0) {
            await this.uploadsService.updateAttachmentsForTarget(
                feedback.id,
                FileTargetType.FEEDBACK,
                fileAttachments,
            );
            }

            await this.prisma.feedbackStatusHistory.create({
            data: {
                feedbackId: feedback.id,
                status: 'PENDING',
                message: GenerateStatusUpdateMessage(
                feedback.department.name,
                'PENDING',
                ),
            },
            });

            // [New Logic] Emit Event: Feedback Created
            // This allows the Notification module to handle notifications asynchronously without blocking this response.
            const feedbackCreatedEvent = new FeedbackCreatedEvent({
                feedbackId: feedback.id,
                userId: actor.sub,
                departmentId: feedback.departmentId,
                subject: feedback.subject,
            });
            this.eventEmitter.emit('feedback.created', feedbackCreatedEvent);

            // Return summary
            return {
                id: feedback.id,
                subject: feedback.subject,
                location: feedback.location ? feedback.location : null,
                currentStatus: feedback.currentStatus,
                isPrivate: feedback.isPrivate,
                department: {
                    id: feedback.department.id,
                    name: feedback.department.name,
                },
                category: {
                    id: feedback.category.id,
                    name: feedback.category.name,
                },
                createdAt: feedback.createdAt.toISOString(),
            };
        }
    }
}

