/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { FeedbackStatus, FileTargetType } from '@prisma/client';
import {
  GetMyFeedbacksResponseDto,
  QueryFeedbacksDto,
  FeedbackDetail,
  FeedbackParamDto,
  FeedbackSummary,
  FeedbackSortOption,
} from './dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { UploadsService } from '../uploads/uploads.service';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { ForumService } from '../forum/forum.service';
import { mergeStatusAndForwardLogs } from 'src/shared/helpers/merge-forwarding_log-and-feedback_status_history';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GenerateStatusUpdateMessage } from 'src/shared/helpers/feedback-message.helper';
import {
  FEEDBACK_SIMILARITY_JOB_ON_CREATED,
  FEEDBACK_SIMILARITY_JOB_ON_UPDATED,
} from '../feedback-similarity/type/feedback-similarity-job.constants';
@Injectable()
export class FeedbacksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly forumService: ForumService,
    private readonly uploadsService: UploadsService,
    @InjectQueue('feedback-toxic') private readonly feedbackToxicQueue: Queue,
    @InjectQueue('feedback-similarity')
    private readonly feedbackSimilarityQueue: Queue,
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
      sort = FeedbackSortOption.STATUS,
    } = query;

    let whereClause = 'WHERE f."userId" = $1::"uuid"';
    type SqlParam = string | number | boolean | Date | null;
    const params: SqlParam[] = [actor.sub];
    let paramIndex = 2;
    const nextParam = () => `$${paramIndex++}`;

    if (departmentId && departmentId !== 'all') {
      whereClause += ` AND f."departmentId" = ${nextParam()}::"uuid"`;
      params.push(departmentId);
    }

    if (status) {
      const normalizedStatus = status.toUpperCase() as FeedbackStatus;
      if (!Object.values(FeedbackStatus).includes(normalizedStatus)) {
        throw new BadRequestException(`Invalid status: ${status}`);
      }
      whereClause += ` AND f."currentStatus" = ${nextParam()}::"FeedbackStatus"`;
      params.push(status.toUpperCase());
    }

    if (categoryId && categoryId !== 'all') {
      whereClause += ` AND f."categoryId" = ${nextParam()}::"uuid"`;
      params.push(categoryId);
    }

    if (from) {
      whereClause += ` AND f."createdAt" >= ${nextParam()}`;
      params.push(new Date(from));
    }

    if (to) {
      whereClause += ` AND f."createdAt" < ${nextParam()}`;
      params.push(new Date(new Date(to).setDate(new Date(to).getDate() + 1)));
    }

    if (q) {
      whereClause += ` AND (f."subject" ILIKE ${nextParam()} OR f."description" ILIKE ${nextParam()})`;
      params.push(`%${q}%`, `%${q}%`);
    }

    // ======================
    // SORT LOGIC
    // ======================
    let joinClause = '';
    const orderByParts: string[] = [];

    // Base: STATUS ORDER
    const statusOrderExpr = `
    CASE
      WHEN f."currentStatus" = 'PENDING' THEN 1
      WHEN f."currentStatus" = 'IN_PROGRESS' THEN 2
      WHEN f."currentStatus" = 'RESOLVED' THEN 3
      WHEN f."currentStatus" = 'REJECTED' THEN 4
      ELSE 5
    END
  `;

    if (sort === FeedbackSortOption.TRENDING) {
      joinClause = `
      LEFT JOIN "ForumPosts" fp ON fp."feedbackId" = f."id"
      LEFT JOIN "Votes" v ON v."postId" = fp."id"
      LEFT JOIN "Comments" cm
        ON cm."targetId" = fp."id"
       AND cm."targetType" = 'FORUM_POST'
    `;

      orderByParts.push(`
      (COUNT(DISTINCT v."userId") * 2 + COUNT(DISTINCT cm."id")) DESC
    `);
    }

    // Base sort
    orderByParts.push(`
    ${statusOrderExpr},
    f."createdAt" DESC
  `);

    const orderByClause = `
    ORDER BY ${orderByParts.join(',')}
  `;

    try {
      const rawResults = await this.prisma.$queryRawUnsafe<any[]>(
        `
      SELECT
        f.*,
        d."name" as "departmentName",
        c."name" as "categoryName"
      FROM "Feedbacks" f
      LEFT JOIN "Departments" d ON f."departmentId" = d."id"
      LEFT JOIN "Categories" c ON f."categoryId" = c."id"
      ${joinClause}
      ${whereClause}
      GROUP BY f."id", d."name", c."name"
      ${orderByClause}
      OFFSET ${(page - 1) * pageSize}
      LIMIT ${pageSize}
      `,
        ...params,
      );

      const [result] = await this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `
      SELECT COUNT(*) as count
      FROM "Feedbacks" f
      ${whereClause}
      `,
        ...params,
      );

      const total = Number(result.count);

      const results: FeedbackSummary[] = rawResults.map((f) => ({
        id: f.id,
        subject: f.subject,
        location: f.location ? f.location : null,
        currentStatus: f.currentStatus,
        isPrivate: f.isPrivate,
        department: {
          id: f.departmentId,
          name: f.departmentName,
        },
        category: {
          id: f.categoryId,
          name: f.categoryName,
        },
        createdAt: new Date(f.createdAt).toISOString(),
      }));

      return {
        results,
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
    const unifiedTimeline = this.filterTimeline(
      mergeStatusAndForwardLogs({
        statusHistory: feedback.statusHistory,
        forwardingLogs: feedback.forwardingLogs.map((f) => ({
          fromDept: f.fromDepartment,
          toDept: f.toDepartment,
          message: f.message,
          note: f.note ?? null,
          createdAt: f.createdAt,
        })),
      }),
    );
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

    if (
      feedback.currentStatus !== FeedbackStatus.PENDING &&
      feedback.currentStatus !== FeedbackStatus.VIOLATED_CONTENT &&
      feedback.currentStatus !== FeedbackStatus.AI_REVIEW_FAILED
    ) {
      throw new ForbiddenException(
        'Feedback can only be updated when in PENDING, VIOLATED_CONTENT, or AI_REVIEW_FAILED status.',
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

    const updateDataNew = {
      ...updateData,
      currentStatus: FeedbackStatus.AI_REVIEWING,
    };

    const embeddingRelevant =
      (dto.subject !== undefined && dto.subject !== feedback.subject) ||
      (dto.description !== undefined &&
        dto.description !== feedback.description) ||
      (dto.departmentId !== undefined &&
        dto.departmentId !== feedback.departmentId);

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

    await this.prisma.feedbackStatusHistory.create({
      data: {
        feedbackId: feedbackId,
        status: 'AI_REVIEWING',
        message: GenerateStatusUpdateMessage(
          updateFeedback.department.name,
          'AI_REVIEWING',
        ),
      },
    });

    const unifiedTimeline = this.filterTimeline(
      mergeStatusAndForwardLogs({
        statusHistory: updateFeedback.statusHistory,
        forwardingLogs: updateFeedback.forwardingLogs.map((f) => ({
          fromDept: f.fromDepartment,
          toDept: f.toDepartment,
          message: f.message,
          note: f.note ?? null,
          createdAt: f.createdAt,
        })),
      }),
    );

    if (embeddingRelevant) {
      const incomingRows: { sourceFeedbackId: string }[] =
        await this.prisma.feedbackSimilarityLink.findMany({
          where: { targetFeedbackId: feedbackId },
          select: { sourceFeedbackId: true },
        });
      const priorIncomingSourceIds = [
        ...new Set(incomingRows.map((r) => r.sourceFeedbackId)),
      ];
      await this.prisma.feedbackSimilarityLink.deleteMany({
        where: {
          OR: [
            { sourceFeedbackId: feedbackId },
            { targetFeedbackId: feedbackId },
          ],
        },
      });
      await this.feedbackSimilarityQueue.add(
        FEEDBACK_SIMILARITY_JOB_ON_UPDATED,
        { feedbackId, priorIncomingSourceIds },
        {
          attempts: 3,
          backoff: 5000,
        },
      );
    }

    await this.feedbackToxicQueue.add(
      'feedbackToxicItem',
      {
        type: 'update',
        feedbackId: feedbackId,
        updateData: updateData,
        dto: dto,
        actor: actor,
      },
      {
        attempts: 3,
        backoff: 5000,
      },
    );
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

    if (
      feedback.currentStatus !== FeedbackStatus.PENDING &&
      feedback.currentStatus !== FeedbackStatus.VIOLATED_CONTENT &&
      feedback.currentStatus !== FeedbackStatus.AI_REVIEW_FAILED
    ) {
      throw new ForbiddenException(
        'Feedback can only be deleted when in PENDING, VIOLATED_CONTENT, or AI_REVIEW_FAILED status.',
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
        currentStatus: FeedbackStatus.AI_REVIEWING,
      },
      include: {
        department: true,
        category: true,
      },
    });
    if (dto.isPublic) {
      await this.forumService.createForumPost(feedback.id, actor);
    }

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
        status: 'AI_REVIEWING',
        message: GenerateStatusUpdateMessage(
          feedback.department.name,
          'AI_REVIEWING',
        ),
      },
    });
    await this.feedbackSimilarityQueue.add(
      FEEDBACK_SIMILARITY_JOB_ON_CREATED,
      { feedbackId: feedback.id },
      {
        attempts: 3,
        backoff: 5000,
      },
    );

    await this.feedbackToxicQueue.add(
      'feedbackToxicItem',
      {
        type: 'create',
        feedback: feedback,
        actor: actor,
      },
      {
        attempts: 3,
        backoff: 5000,
      },
    );
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

  async resubmitFeedback(
    params: FeedbackParamDto,
    actor: ActiveUserData,
  ): Promise<void> {
    const { feedbackId } = params;
    const feedback = await this.prisma.feedbacks.findFirst({
      where: { id: feedbackId, userId: actor.sub },
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
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }
    if (feedback.currentStatus !== FeedbackStatus.AI_REVIEW_FAILED) {
      throw new ForbiddenException(
        'Only feedbacks in AI_REVIEW_FAILED status can be resubmitted.',
      );
    }
    await this.prisma.feedbacks.update({
      where: { id: feedbackId },
      data: {
        currentStatus: FeedbackStatus.AI_REVIEWING,
      },
    });
    await this.prisma.feedbackStatusHistory.create({
      data: {
        feedbackId: feedbackId,
        status: 'AI_REVIEWING',
        message: GenerateStatusUpdateMessage(
          feedback.department.name,
          'AI_REVIEWING',
        ),
      },
    });
    await this.feedbackToxicQueue.add(
      'feedbackToxicItem',
      {
        type: 'resubmit',
        feedback: feedback,
        actor: actor,
      },
      {
        attempts: 3,
        backoff: 5000,
      },
    );
    return;
  }
  async getToxicJobStatus(jobId: string) {
    const job = await this.feedbackToxicQueue.getJob(jobId);
    if (!job) {
      throw new NotFoundException('job not found');
    }
    const state = await job.getState();
    switch (state) {
      case 'completed':
        await this.feedbackToxicQueue.remove(jobId);
        return {
          status: 'APPROVED',
        };
      case 'failed':
        await this.feedbackToxicQueue.remove(jobId);
        return {
          status: 'REJECTED',
        };
      default:
        return {
          status: 'PENDING',
        };
    }
  }

  private filterTimeline(timeline: any[]) {
    const lastPendingIndex = timeline
      .map((t) => t.status)
      .lastIndexOf('PENDING');
    const lastAiReviewingIndex = timeline
      .map((t) => t.status)
      .lastIndexOf('AI_REVIEWING');
    const lastAiReviewSuccessIndex = timeline
      .map((t) => t.status)
      .lastIndexOf('AI_REVIEW_SUCCESS');

    return timeline.filter((item, index) => {
      if (item.status === 'PENDING') return index === lastPendingIndex;
      if (item.status === 'AI_REVIEWING') return index === lastAiReviewingIndex;
      if (item.status === 'AI_REVIEW_SUCCESS')
        return index === lastAiReviewSuccessIndex;
      return true;
    });
  }
}
