import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForumService } from '../forum/forum.service';
import { UploadsService } from '../uploads/uploads.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedbackCreatedEvent } from './events/feedback-created.event';
import { GenerateStatusUpdateMessage } from 'src/shared/helpers/feedback-message.helper';
import { FileTargetType } from '@prisma/client';
import { CreateFeedbackDto, FeedbackSummary} from './dto';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { FeedbackJobData } from './dto/feedback-job-data.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { mergeStatusAndForwardLogs } from 'src/shared/helpers/merge-forwarding_log-and-feedback_status_history';
import { FeedbackDetail } from './dto';
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
  async process(
    job: Job<FeedbackJobData,FeedbackSummary>): Promise<FeedbackSummary|FeedbackDetail> {
        const {type} = job.data;
        switch (type) {
        case 'create':
          return this.handleCreateFeedback(job.data);

        case 'update':
          return this.handleUpdateFeedback(job.data);

        default:
          throw new UnrecoverableError(`Unsupported job type: ${type}`);
  }
        
  }
  async handleUpdateFeedback(data: {
  feedbackId: string;
  updateFileAttachments: any,
  updateData: any,
  dto: UpdateFeedbackDto;
  actor: ActiveUserData;
  }): Promise<FeedbackDetail> {
    const {updateData,updateFileAttachments,feedbackId, dto, actor } = data;
    const isToxic = await this.aiService.checkToxicity(dto.description || '');
    if(isToxic){
      const updateDataNew = {
        ...updateData,
        currentStatus: 'TOXIC',
      };
      await this.prisma.feedbacks.update({
        where: { id: feedbackId },
        data: updateDataNew,
        include: {
          department: {
            select: { id: true, name: true },
          },
          category: {
            select: { id: true, name: true },
          },
          statusHistory: {
            select: {
              status: true,
              message: true,
              note: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          forumPost: {
            select: { id: true },
          },
          forwardingLogs: {
            select: {
              id: true,
              message: true,
              createdAt: true,
              note: true,
              fromDepartment: { select: { id: true, name: true } },
              toDepartment: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      // Emit Event: Toxic Feedback Updated
      const feedbackCreatedEvent = new FeedbackCreatedEvent({
        feedbackId: feedbackId,
        userId: actor.sub,
        departmentId: updateData.departmentId,
        subject: updateData.subject,
        isToxic: true,
      });
      this.eventEmitter.emit('feedback.created', feedbackCreatedEvent);
      throw new UnrecoverableError(
        'Feedback description contains toxic content. Please modify and try again.',
      );
    }
    else{
      const updateDataNew = {
        ...updateData,
        currentStatus: "PENDING",
      };
      const updateFeedback = await this.prisma.feedbacks.update({
        where: { id: feedbackId },
        data: updateDataNew,
        include: {
          department: {
            select: { id: true, name: true },
          },
          category: {
            select: { id: true, name: true },
          },
          statusHistory: {
            select: {
              status: true,
              message: true,
              note: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          forumPost: {
            select: { id: true },
          },
          forwardingLogs: {
            select: {
              id: true,
              message: true,
              createdAt: true,
              note: true,
              fromDepartment: { select: { id: true, name: true } },
              toDepartment: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      const unifiedTimeline = mergeStatusAndForwardLogs({
        statusHistory: updateFeedback.statusHistory,
        forwardingLogs: updateFeedback.forwardingLogs.map((f) => ({
          fromDept: f.fromDepartment,
          toDept: f.toDepartment,
          message: f.message,
          note: f.note ?? null,
          createdAt: f.createdAt,
        })),
      });
      return {
        id: updateFeedback.id,
        isPublic: updateFeedback.forumPost ? true : false,
        subject: updateFeedback.subject,
        description: updateFeedback.description,
        location: updateFeedback.location ? updateFeedback.location : null,
        currentStatus: updateFeedback.currentStatus,
        isPrivate: updateFeedback.isPrivate,
        createdAt: updateFeedback.createdAt.toISOString(),
        department: {
          id: updateFeedback.department.id,
          name: updateFeedback.department.name,
        },
        category: {
          id: updateFeedback.category.id,
          name: updateFeedback.category.name,
        },
        statusHistory: unifiedTimeline,
        fileAttachments: updateFileAttachments,
      };
    }
       

  }
  async handleCreateFeedback(data: {
    dto: CreateFeedbackDto;
    actor: ActiveUserData;
  }): Promise<FeedbackSummary> {
     const { dto, actor } = data;
        const { fileAttachments, ...feedbackData } = dto;
        const isToxic = await this.aiService.checkToxicity(dto.description);
        if (isToxic) {
            const feedback = await this.prisma.feedbacks.create({
            data: {
                subject: feedbackData.subject,
                description: feedbackData.description,
                location: feedbackData.location,
                isPrivate: dto.isAnonymous ? true : false,
                departmentId: feedbackData.departmentId,
                categoryId: feedbackData.categoryId,
                currentStatus: 'TOXIC',
                userId: actor.sub,
            },
            include: {
                department: true,
                category: true,
            },
            });
            // Emit Event: Toxic Feedback Created
            const feedbackCreatedEvent = new FeedbackCreatedEvent({
              feedbackId: feedback.id,
              userId: actor.sub,
              departmentId: feedback.departmentId,
              subject: feedback.subject,
              isToxic: true,
            });
            this.eventEmitter.emit('feedback.created', feedbackCreatedEvent);
            throw new UnrecoverableError(
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
        isToxic: false,
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