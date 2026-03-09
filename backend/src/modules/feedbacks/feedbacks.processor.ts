import { OnWorkerEvent, Processor, WorkerHost  } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedbackCreatedEvent } from './events/feedback-created.event';
import { FeedbackStatus } from '@prisma/client';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { FeedbackJobData } from './dto/feedback-job-data.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
@Processor('feedback-toxic')
export class FeedbackToxicProcessor extends WorkerHost {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }
  async process(job: Job<FeedbackJobData>): Promise<void> {
    const { type } = job.data;
    switch (type) {
      case 'create':
        await this.handleCreateFeedback(job.data);
        break;
      case 'update':
        await this.handleUpdateFeedback(job.data);
        break;

      default:
        throw new UnrecoverableError(`Unsupported job type: ${type}`);
    }
  }
  async handleUpdateFeedback(data: {
    feedbackId: string;
    updateData: any;
    dto: UpdateFeedbackDto;
    actor: ActiveUserData;
  }) {
    const { updateData, feedbackId, dto, actor } = data;
    const isToxic = await this.aiService.checkToxicity(
      dto.description || '',
      data,
      'update',
    );
    if (isToxic) {
      await this.prisma.feedbacks.update({
        where: { id: feedbackId },
        data: {
          currentStatus: FeedbackStatus.VIOLATED_CONTENT,
        },
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
    } else {
      await this.prisma.feedbacks.update({
        where: { id: feedbackId },
        data: {
          currentStatus: FeedbackStatus.PENDING,
        },
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
        isToxic: false,
      });
      this.eventEmitter.emit('feedback.created', feedbackCreatedEvent);
    }
  }
  async handleCreateFeedback(data: { feedback: any; actor: ActiveUserData }) {
    const { feedback, actor } = data;
    const isToxic = await this.aiService.checkToxicity(
      feedback.description,
      feedback,
      'create',
    );
    if (isToxic) {
      await this.prisma.feedbacks.update({
        where: { id: feedback.id },
        data: {
          currentStatus: FeedbackStatus.VIOLATED_CONTENT,
        },
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
    } else {
      await this.prisma.feedbacks.update({
        where: { id: feedback.id },
        data: {
          currentStatus: FeedbackStatus.PENDING,
        },
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
    }
  }
  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error) {
    if(job.attemptsMade >= (job.opts.attempts ?? 1)) {
      if (job.data.type === 'create') {
        const { feedback, actor } = job.data;
        // Emit event for new feedback with FAULT_GEMINI status
        const feedbackCreatedEvent = new FeedbackCreatedEvent({
          feedbackId: feedback.id,
          userId: actor.sub,
          departmentId: feedback.departmentId,
          subject: feedback.subject,
          isToxic: true,
        });
        this.eventEmitter.emit('feedback.fault.api.gemini', feedbackCreatedEvent);
      } else if (job.data.type === 'update') {
        const { updateData, feedbackId, actor } = job.data;
        // Emit event for new feedback with FAULT_GEMINI status
        const feedbackCreatedEvent = new FeedbackCreatedEvent({
          feedbackId: feedbackId,
          userId: actor.sub,
          departmentId: updateData.departmentId,
          subject: updateData.subject,
          isToxic: true,
        });
        this.eventEmitter.emit('feedback.fault.api.gemini', feedbackCreatedEvent);
      }
    }
  }
}
