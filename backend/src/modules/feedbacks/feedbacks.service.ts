import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma, FeedbackStatus, FileTargetType } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter'; // [Import 1] Import EventEmitter
import { AiService } from '../ai/ai.service';
import {
  FeedbackSummary,
  GetMyFeedbacksResponseDto,
  QueryFeedbacksDto,
  FeedbackDetail,
  FeedbackParamDto,
} from './dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { UploadsService } from '../uploads/uploads.service';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { ForumService } from '../forum/forum.service';
import { mergeStatusAndForwardLogs } from 'src/shared/helpers/merge-forwarding_log-and-feedback_status_history';
// [Import 2] Import the event definition
import { FeedbackCreatedEvent } from './events/feedback-created.event';
import { GenerateStatusUpdateMessage } from 'src/shared/helpers/feedback-message.helper';

@Injectable()
export class FeedbacksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly forumService: ForumService,
    private readonly uploadsService: UploadsService,
    private readonly eventEmitter: EventEmitter2, // [Injection] Inject EventEmitter2
    private readonly aiService: AiService,
  ) {}

  async getFeedbacks(
    query: QueryFeedbacksDto,
    actor: ActiveUserData,
  ): Promise<GetMyFeedbacksResponseDto> {
    const {
      page = 1,
      pageSize = 10,
      status,
      categoryId,
      departmentId,
      from,
      to,
      q,
    } = query;

    const whereClause: Prisma.FeedbacksWhereInput = {
      userId: actor.sub,
      ...(status && {
        currentStatus:
          status.toUpperCase() in FeedbackStatus
            ? (status.toUpperCase() as FeedbackStatus)
            : undefined,
      }),
      ...(categoryId && {
        categoryId: categoryId == 'all' ? undefined : categoryId,
      }),
      ...(departmentId && {
        departmentId: departmentId == 'all' ? undefined : departmentId,
      }),
      ...(from || to
        ? {
            createdAt: {
              ...(from && { gte: new Date(from) }),
              ...(to && {
                lt: new Date(new Date(to).setDate(new Date(to).getDate() + 1)),
              }),
            },
          }
        : {}),
      ...(q && {
        OR: [
          { subject: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }),
    };

    try {
      const [items, total] = await Promise.all([
        this.prisma.feedbacks.findMany({
          where: whereClause,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            subject: true,
            location: true,
            currentStatus: true,
            isPrivate: true,
            department: {
              select: { id: true, name: true },
            },
            category: { select: { id: true, name: true } },
            createdAt: true,
          },
        }),
        this.prisma.feedbacks.count({ where: whereClause }),
      ]);
      return {
        results: items
          ? items.map((item) => ({
              ...item,
              location: item.location ? item.location : null,
              createdAt: item.createdAt.toISOString(),
            }))
          : [],
        total,
      };
    } catch (error) {
      throw new Error('Error fetching feedbacks:', { cause: error });
    }
  }

  async getFeedbackDetail(
    params: FeedbackParamDto,
    actor: ActiveUserData,
  ): Promise<FeedbackDetail> {
    const { feedbackId } = params; //

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, userId: actor.sub },
      include: {
        department: {
          select: { id: true, name: true },
        },
        forumPost: {
          select: { id: true },
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
        forwardingLogs: {
          select: {
            id: true,
            message: true,
            note: true,
            createdAt: true,

            fromDepartment: {
              select: { id: true, name: true },
            },
            toDepartment: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found`);
    }
    const unifiedTimeline = mergeStatusAndForwardLogs({
      statusHistory: feedback.statusHistory,
      forwardingLogs: feedback.forwardingLogs.map((f) => ({
        fromDept: f.fromDepartment,
        toDept: f.toDepartment,
        message: f.message,
        note: f.note ?? null,
        createdAt: f.createdAt,
      })),
    });
    const fileAttachments = await this.uploadsService.getAttachmentsForTarget(
      feedback.id,
      FileTargetType.FEEDBACK,
    );

    const result: FeedbackDetail = {
      id: feedback.id,
      subject: feedback.subject,
      description: feedback.description,
      location: feedback.location ? feedback.location : null,
      currentStatus: feedback.currentStatus,
      isPrivate: feedback.isPrivate,
      isPublic: feedback.forumPost ? true : false,
      createdAt: feedback.createdAt.toISOString(),
      department: {
        id: feedback.department.id,
        name: feedback.department.name,
      },
      category: {
        id: feedback.category.id,
        name: feedback.category.name,
      },
      statusHistory: unifiedTimeline,
      fileAttachments: fileAttachments,
    };
    return result;
  }

  async updateFeedback(
    params: FeedbackParamDto,
    dto: UpdateFeedbackDto,
    actor: ActiveUserData,
  ): Promise<FeedbackDetail> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, userId: actor.sub },
      include: {
        forumPost: { select: { id: true } },
      },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }

    if (feedback.currentStatus !== FeedbackStatus.PENDING) {
      throw new ForbiddenException(
        'Feedback can only be updated when in PENDING status.',
      );
    }
    if (dto.isAnonymous === true && dto.isPublic === true) {
      throw new ForbiddenException(
        'Feedback cannot be public when it is anonymous.',
      );
    }

    if (dto.departmentId) {
      const department = await this.prisma.departments.findUnique({
        where: { id: dto.departmentId },
      });
      if (!department) {
        throw new NotFoundException('Department not found');
      }
    }
    if (dto.categoryId) {
      const category = await this.prisma.categories.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    if (dto.isPublic === false && feedback.forumPost) {
      await this.forumService.deleteByFeedbackId(feedbackId);
    } else if (
      dto.isPublic === true &&
      !feedback.forumPost &&
      dto.isAnonymous === false
    ) {
      await this.forumService.createForumPost(feedbackId, actor);
    }

    const updateMapped = {
      ...dto,
      isPrivate:
        dto.isAnonymous !== undefined ? dto.isAnonymous : feedback.isPrivate,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fileAttachments, isPublic, isAnonymous, ...updateData } =
      updateMapped;

    const updateFileAttachments =
      await this.uploadsService.updateAttachmentsForTarget(
        feedbackId,
        FileTargetType.FEEDBACK,
        dto.fileAttachments ?? [],
      );

    const updateFeedback = await this.prisma.feedbacks.update({
      where: { id: feedbackId },
      data: updateData,
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

  async deleteFeedback(
    params: FeedbackParamDto,
    actor: ActiveUserData,
  ): Promise<void> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, userId: actor.sub },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }

    if (feedback.currentStatus !== FeedbackStatus.PENDING) {
      throw new ForbiddenException(
        'Feedback can only be deleted when in PENDING status.',
      );
    }

    await this.uploadsService.deleteAttachmentsForTarget(
      feedbackId,
      FileTargetType.FEEDBACK,
    );

    await this.prisma.feedbacks.delete({
      where: { id: feedbackId, userId: actor.sub },
    });
  }

  async createFeedback(
    dto: CreateFeedbackDto,
    actor: ActiveUserData,
  ): Promise<FeedbackSummary> {
    const [department, category] = await Promise.all([
      this.prisma.departments.findUnique({
        where: { id: dto.departmentId },
      }),
      this.prisma.categories.findUnique({
        where: { id: dto.categoryId },
      }),
    ]);

    if (!department) {
      throw new NotFoundException('Department not found');
    }
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (category.isActive === false) {
      throw new ForbiddenException(
        'You cannot create feedback under an inactive category.',
      );
    }
    if (department.isActive === false) {
      throw new ForbiddenException(
        'You cannot create feedback to an inactive department.',
      );
    }

    const { fileAttachments, ...feedbackData } = dto;
    if(await this.aiService.checkToxicity(dto.description)) {
      throw new ForbiddenException(
        'Feedback description contains toxic content. Please modify and try again.',
      );
    }
    else {
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
