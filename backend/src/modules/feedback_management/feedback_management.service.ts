import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeedbackStatus, FileTargetType, Prisma } from '@prisma/client';
import { FeedbackParamDto, QueryFeedbacksDto } from 'src/modules/feedbacks/dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  GenerateForwardingMessage,
  GenerateStatusUpdateMessage,
} from 'src/shared/helpers/feedback-message.helper';
import { mergeStatusAndForwardLogs } from 'src/shared/helpers/merge-forwarding_log-and-feedback_status_history';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { UploadsService } from '../uploads/uploads.service';
import {
  CreateForwardingDto,
  FeedbackDetailDto,
  ForwardingResponseDto,
  ListFeedbacksResponseDto,
  QueryFeedbackByStaffDto,
  UpdateFeedbackStatusDto,
  UpdateFeedbackStatusResponseDto,
} from './dto';
import { FeedbackStatusUpdatedEvent } from './events/feedback-status-updated.event';
import { RawFeedbackJoinedRow } from './types/raw-feedbacks-joined-row';
@Injectable()
export class FeedbackManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
    private readonly eventEmitter: EventEmitter2, // [Injection]
  ) {}

  async getAllStaffFeedbacks(
    query: QueryFeedbackByStaffDto,
    actor: ActiveUserData,
  ): Promise<ListFeedbacksResponseDto> {
    const { page = 1, pageSize = 10, status, categoryId, from, to, q } = query;

    const where: Prisma.FeedbacksWhereInput = {
      OR: [
        { departmentId: actor.departmentId },

        {
          forwardingLogs: {
            some: { fromDepartmentId: actor.departmentId },
          },
        },
      ],
    };

    if (status) {
      where.currentStatus = Object.values(FeedbackStatus).includes(
        status.toUpperCase() as FeedbackStatus,
      )
        ? (status.toUpperCase() as FeedbackStatus)
        : undefined;
    }
    if (categoryId) where.categoryId = categoryId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        where.createdAt.lt = new Date(
          new Date(to).setDate(new Date(to).getDate() + 1),
        );
      }
    }

    if (q) {
      where.OR = [
        { subject: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedbacks.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          department: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          user: { select: { id: true, fullName: true, email: true } },
          forwardingLogs: {
            select: { toDepartmentId: true, fromDepartmentId: true },
          },
        },
      }),
      this.prisma.feedbacks.count({ where }),
    ]);

    const results = feedbacks.map((f) => ({
      id: f.id,
      subject: f.subject,
      location: f.location ? f.location : null,
      currentStatus: f.currentStatus,
      isPrivate: f.isPrivate,
      department: f.department,
      category: f.category,
      createdAt: f.createdAt.toISOString(),
      isForwarding:
        f.department.id !== actor.departmentId &&
        f.forwardingLogs.some(
          (log) => log.fromDepartmentId === actor.departmentId,
        ),
      ...(f.isPrivate
        ? {}
        : {
            student: {
              id: f.user.id,
              fullName: f.user.fullName,
              email: f.user.email,
            },
          }),
    }));

    return { results, total };
  }
  async getStaffFeedbackDetail(
    params: FeedbackParamDto,
    actor: ActiveUserData,
  ): Promise<FeedbackDetailDto> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findFirst({
      where: {
        id: feedbackId,
        OR: [
          { departmentId: actor.departmentId },
          {
            forwardingLogs: {
              some: {
                fromDepartmentId: actor.departmentId,
              },
            },
          },
        ],
      },
      include: {
        user: true,
        forumPost: {
          select: { id: true },
        },
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
        forwardingLogs: {
          select: {
            id: true,
            message: true,
            createdAt: true,
            note: true,
            fromDepartment: {
              select: { id: true, name: true },
            },
            toDepartment: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        // Không include file ở đây
      },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    const isForwarding =
      feedback.department.id !== actor.departmentId &&
      feedback.forwardingLogs.some(
        (log) => log.fromDepartment.id === actor.departmentId,
      );
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

    const result: FeedbackDetailDto = {
      id: feedback.id,
      isPublic: feedback.forumPost ? true : false,
      subject: feedback.subject,
      description: feedback.description,
      location: feedback.location,
      currentStatus: feedback.currentStatus,
      isPrivate: feedback.isPrivate,
      createdAt: feedback.createdAt.toISOString(),
      ...(feedback.isPrivate
        ? {}
        : {
            student: {
              id: feedback.user.id,
              fullName: feedback.user.fullName,
              email: feedback.user.email,
            },
          }),
      forumPost: feedback.forumPost ? { id: feedback.forumPost.id } : undefined,
      department: feedback.department,
      isForwarding,
      category: feedback.category,
      statusHistory: unifiedTimeline,
      fileAttachments: fileAttachments,
    };

    return result;
  }
  async updateStatus(
    params: FeedbackParamDto,
    dto: UpdateFeedbackStatusDto,
    actor: ActiveUserData,
  ): Promise<UpdateFeedbackStatusResponseDto> {
    const { feedbackId } = params;

    // Cần đảm bảo feedback tồn tại và lấy userId, subject để bắn event
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, departmentId: actor.departmentId },
      include: { department: true },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    const updatedFeedback = await this.prisma.feedbacks.update({
      where: { id: feedbackId, departmentId: actor.departmentId },
      data: {
        currentStatus: dto.status,
      },
    });

    await this.prisma.feedbackStatusHistory.create({
      data: {
        feedbackId: feedback.id,
        status: dto.status,
        message: GenerateStatusUpdateMessage(
          feedback.department.name,
          dto.status,
        ),
        note: dto.note ?? null,
      },
    });

    // [New Logic] Emit Event: Feedback Status Updated
    const event = new FeedbackStatusUpdatedEvent({
      feedbackId: feedback.id,
      userId: feedback.userId, // Student ID
      subject: feedback.subject,
      status: dto.status, // New Status
    });
    this.eventEmitter.emit('feedback.status_updated', event);

    return {
      feedbackId: updatedFeedback.id,
      currentStatus: updatedFeedback.currentStatus,
    };
  }
  async createForwarding(
    feedbackId: string,
    dto: CreateForwardingDto,
    actor: ActiveUserData,
  ): Promise<ForwardingResponseDto> {
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, departmentId: actor.departmentId },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback not found`);
    }
    if (feedback.departmentId !== actor.departmentId) {
      throw new ForbiddenException(
        `You are not allowed to forward feedback #${feedbackId} belonging to another department`,
      );
    }
    const toDepartment = await this.prisma.departments.findUnique({
      where: { id: dto.toDepartmentId },
    });

    if (!toDepartment) {
      throw new NotFoundException(
        `Department with ID ${dto.toDepartmentId} not found`,
      );
    }

    if (dto.toDepartmentId === actor.departmentId) {
      throw new BadRequestException('Cannot forward to the same department');
    }

    const forwarding = await this.prisma.forwardingLogs.create({
      data: {
        feedbackId,
        fromDepartmentId: actor.departmentId,
        toDepartmentId: dto.toDepartmentId,
        userId: actor.sub,
        message: GenerateForwardingMessage(toDepartment.name),
        note: dto.note,
      },
      include: {
        fromDepartment: true,
        toDepartment: true,
      },
    });

    await this.prisma.feedbacks.update({
      where: { id: feedbackId },
      data: {
        departmentId: dto.toDepartmentId,
        currentStatus: FeedbackStatus.IN_PROGRESS,
      },
    });
    return {
      forwardingLogId: forwarding.id,
      feedbackId: forwarding.feedbackId,
      fromDepartment: {
        id: forwarding.fromDepartment.id,
        name: forwarding.fromDepartment.name,
      },
      toDepartment: {
        id: forwarding.toDepartment.id,
        name: forwarding.toDepartment.name,
      },
      message: forwarding.message,
      note: forwarding.note ?? null,
      createdAt: forwarding.createdAt.toISOString(),
    };
  }
  async getAllFeedbacks(
    query: QueryFeedbacksDto,
  ): Promise<ListFeedbacksResponseDto> {
    const {
      page = 1,
      pageSize = 12,
      status,
      departmentId,
      categoryId,
      from,
      to,
      q,
    } = query;

    // Sử dụng raw query để order theo status custom và join bảng liên quan
    let whereClause = 'WHERE 1=1';
    type SqlParam = string | number | boolean | Date | null;

    const params: SqlParam[] = [];

    if (status) {
      whereClause += ' AND f."currentStatus" = ?';
      params.push(status.toUpperCase());
    }
    if (departmentId) {
      whereClause += ' AND f."departmentId" = ?';
      params.push(departmentId);
    }
    if (categoryId) {
      whereClause += ' AND f."categoryId" = ?';
      params.push(categoryId);
    }
    if (from) {
      whereClause += ' AND f."createdAt" >= ?';
      params.push(new Date(from));
    }
    if (to) {
      whereClause += ' AND f."createdAt" < ?';
      params.push(new Date(new Date(to).setDate(new Date(to).getDate() + 1)));
    }
    if (q) {
      whereClause += ' AND (f."subject" ILIKE ? OR f."description" ILIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    // Raw query join Department, Category, User
    const rawResults = await this.prisma.$queryRawUnsafe<
      RawFeedbackJoinedRow[]
    >(
      `
      SELECT
        f.*,
        d."name" as "departmentName",
        c."name" as "categoryName",
        u."id" as "studentId",
        u."fullName" as "studentFullName",
        u."email" as "studentEmail"
      FROM "Feedbacks" f
      LEFT JOIN "Departments" d ON f."departmentId" = d."id"
      LEFT JOIN "Categories" c ON f."categoryId" = c."id"
      LEFT JOIN "Users" u ON u."id" = f."userId"
      ${whereClause}
      ORDER BY CASE
        WHEN f."currentStatus" = 'PENDING' THEN 1
        WHEN f."currentStatus" = 'IN_PROGRESS' THEN 2
        WHEN f."currentStatus" = 'RESOLVED' THEN 3
        WHEN f."currentStatus" = 'REJECTED' THEN 4
        ELSE 5
      END, f."createdAt" DESC
      OFFSET ${(page - 1) * pageSize}
      LIMIT ${pageSize}
      `,
      ...params,
    );
    console.log(rawResults);

    // Đếm tổng số kết quả
    const [result] = await this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `
  SELECT COUNT(*) as count
  FROM "Feedbacks" f
  ${whereClause}
  `,
      ...params,
    );

    const total = Number(result.count);

    // Map lại kết quả cho đúng DTO
    const results = rawResults.map((f) => ({
      id: f.id,
      subject: f.subject,
      location: f.location,
      currentStatus: f.currentStatus,
      isPrivate: f.isPrivate,
      department: { id: f.departmentId, name: f.departmentName },
      category: { id: f.categoryId, name: f.categoryName },
      createdAt: new Date(f.createdAt).toISOString(),
      ...(f.isPrivate
        ? null
        : {
            student: {
              id: f.studentId,
              fullName: f.studentFullName,
              email: f.studentEmail,
            },
          }),
    }));

    return { results, total };
  }
  async getFeedbackDetail(
    params: FeedbackParamDto,
  ): Promise<FeedbackDetailDto> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: {
        id: feedbackId,
      },
      include: {
        user: true,
        forumPost: {
          select: { id: true },
        },
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
        forwardingLogs: {
          select: {
            id: true,
            message: true,
            createdAt: true,
            note: true,
            fromDepartment: {
              select: { id: true, name: true },
            },
            toDepartment: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        // Không include file ở đây
      },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
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

    const result: FeedbackDetailDto = {
      id: feedback.id,
      isPublic: feedback.forumPost ? true : false,
      subject: feedback.subject,
      description: feedback.description,
      location: feedback.location,
      currentStatus: feedback.currentStatus,
      isPrivate: feedback.isPrivate,
      createdAt: feedback.createdAt.toISOString(),
      ...(feedback.isPrivate
        ? {}
        : {
            student: {
              id: feedback.user.id,
              fullName: feedback.user.fullName,
              email: feedback.user.email,
            },
          }),
      forumPost: feedback.forumPost ? { id: feedback.forumPost.id } : undefined,
      department: feedback.department,
      category: feedback.category,
      statusHistory: unifiedTimeline,
      fileAttachments: fileAttachments,
    };

    return result;
  }
}
