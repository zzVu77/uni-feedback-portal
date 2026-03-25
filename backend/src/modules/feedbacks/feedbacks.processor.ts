import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedbackCreatedEvent } from './events/feedback-created.event';
import { FeedbackStatus } from '@prisma/client';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { FeedbackJobData } from './dto/feedback-job-data.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Prisma } from '@prisma/client';
import { FeedbackDetail } from './dto';
import { AiDataContext } from './dto/feedback-job-data.dto';
import { GenerateStatusUpdateMessage } from 'src/shared/helpers/feedback-message.helper';
@Processor('feedback-toxic')
export class FeedbackToxicProcessor extends WorkerHost {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }
  private readonly defaultFeedbackInclude = {
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
      orderBy: { createdAt: Prisma.SortOrder.asc },
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
      orderBy: { createdAt: Prisma.SortOrder.asc },
    },
  };
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
        throw new UnrecoverableError(
          `Unsupported job type: create or update expected`,
        );
    }
  }
  // Sử dụng chung hàm này cho cả create và update để tránh trùng lặp code
  async handleUpdateFeedback(data: {
    feedbackId: string;
    updateData: UpdateFeedbackDto;
    actor: ActiveUserData;
  }) {
    await this.processToxicity({
      feedbackId: data.feedbackId,
      description: data.updateData.description || '',
      departmentId: data.updateData.departmentId || '',
      subject: data.updateData.subject || '',
      actorId: data.actor.sub,
      aiDataContext: data,
      jobType: 'update',
    });
  }
  async handleCreateFeedback(data: {
    feedback: FeedbackDetail;
    actor: ActiveUserData;
  }) {
    await this.processToxicity({
      feedbackId: data.feedback.id,
      description: data.feedback.description,
      departmentId: data.feedback.department.id,
      subject: data.feedback.subject,
      actorId: data.actor.sub,
      aiDataContext: data.feedback,
      jobType: 'create',
    });
  }
  private async processToxicity(params: {
    feedbackId: string;
    description: string;
    departmentId: string;
    subject: string;
    actorId: string;
    aiDataContext: AiDataContext;
    jobType: 'create' | 'update';
  }) {
    const {
      feedbackId,
      description,
      departmentId,
      subject,
      actorId,
      aiDataContext,
      jobType,
    } = params;

    const isToxic = await this.aiService.checkToxicity(
      description,
      aiDataContext,
      jobType,
    );

    await this.prisma.feedbacks.update({
      where: { id: feedbackId },
      data: {
        currentStatus: isToxic
          ? FeedbackStatus.VIOLATED_CONTENT
          : FeedbackStatus.PENDING,
      },
      include: this.defaultFeedbackInclude,
    });
    const department = await this.prisma.departments.findUnique({
      where: { id: departmentId },
      select: { id: true, name: true },
    });
    if (!department) {
      throw new UnrecoverableError('Department not found');
    }
    if (isToxic) {
      await this.prisma.feedbackStatusHistory.create({
        data: {
          feedbackId: feedbackId,
          status: 'VIOLATED_CONTENT',
          message: GenerateStatusUpdateMessage('', 'VIOLATED_CONTENT'),
        },
      });
    } else {
      await this.prisma.feedbackStatusHistory.create({
        data: {
          feedbackId: feedbackId,
          status: 'PENDING',
          message: GenerateStatusUpdateMessage(department.name, 'PENDING'),
        },
      });
    }

    this.eventEmitter.emit(
      'feedback.created',
      new FeedbackCreatedEvent({
        feedbackId,
        userId: actorId,
        departmentId,
        subject,
        isToxic,
      }),
    );

    // Throw error nếu có toxic
    if (isToxic) {
      throw new UnrecoverableError(
        'Feedback description contains toxic content. Please modify and try again.',
      );
    }
  }
  // Xử lý khi job thất bại sau tất cả các lần thử
  @OnWorkerEvent('failed')
  async onFailed(job: Job<FeedbackJobData>) {
    let eventPayload: FeedbackCreatedEvent | null = null;
    // Chỉ xử lý khi đã hết tất cả các lần thử
    if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
      if (job.data.type === 'create') {
        const { feedback, actor } = job.data;
        eventPayload = {
          feedbackId: feedback.id,
          userId: actor.sub,
          departmentId: feedback.department.id,
          subject: feedback.subject,
          isToxic: true,
        };
        await this.prisma.feedbackStatusHistory.create({
          data: {
            feedbackId: feedback.id,
            status: 'AI_REVIEW_FAILED',
            message: GenerateStatusUpdateMessage('', 'AI_REVIEW_FAILED'),
          },
        });
      } else if (job.data.type === 'update') {
        const { updateData, feedbackId, actor } = job.data;
        eventPayload = {
          feedbackId: feedbackId,
          userId: actor.sub,
          departmentId: updateData.departmentId || '',
          subject: updateData.subject || '',
          isToxic: true,
        };
        await this.prisma.feedbackStatusHistory.create({
          data: {
            feedbackId: feedbackId,
            status: 'AI_REVIEW_FAILED',
            message: GenerateStatusUpdateMessage('', 'AI_REVIEW_FAILED'),
          },
        });
      }
      if (eventPayload) {
        this.eventEmitter.emit(
          'feedback.fault.api.gemini',
          new FeedbackCreatedEvent(eventPayload),
        );
      }
    }
  }
}
