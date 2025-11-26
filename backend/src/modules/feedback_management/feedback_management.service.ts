import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { FeedbackStatus, Prisma } from '@prisma/client';
import {
  FeedbackDetailDto,
  ForwardingResponseDto,
  ListFeedbacksResponseDto,
  UpdateFeedbackStatusDto,
  UpdateFeedbackStatusResponseDto,
  CreateForwardingDto,
  QueryFeedbackByStaffDto,
} from './dto';
import { FeedbackParamDto, QueryFeedbacksDto } from 'src/modules/feedbacks/dto';
import {
  GenerateForwardingMessage,
  GenerateStatusUpdateMessage,
} from 'src/shared/helpers/feedback-message.helper';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { mergeStatusAndForwardLogs } from 'src/shared/helpers/merge-forwarding_log-and-feedback_status_history';
@Injectable()
export class FeedbackManagementService {
  constructor(private readonly prisma: PrismaService) {}

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
        fileAttachments: {
          select: { id: true, fileName: true, fileUrl: true },
        },
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
    const result: FeedbackDetailDto = {
      id: feedback.id,
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

      // statusHistory: feedback.statusHistory.map((h) => ({
      //   status: h.status,
      //   message: h.message,
      //   note: h.note ?? null,
      //   createdAt: h.createdAt.toISOString(),
      // })),
      // forwardingLogs: feedback.forwardingLogs.map((log) => ({
      //   id: log.id,
      //   fromDepartment: log.fromDepartment,
      //   toDepartment: log.toDepartment,
      //   message: log.message,
      //   createdAt: log.createdAt.toISOString(),
      // })),
      fileAttachments: feedback.fileAttachments,
    };

    return result;
  }
  async updateStatus(
    params: FeedbackParamDto,
    dto: UpdateFeedbackStatusDto,
    actor: ActiveUserData,
  ): Promise<UpdateFeedbackStatusResponseDto> {
    const { feedbackId } = params;

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
      pageSize = 10,
      status,
      departmentId,
      categoryId,
      from,
      to,
      q,
    } = query;

    const where: Prisma.FeedbacksWhereInput = {};

    if (status) where.currentStatus = status;
    if (departmentId) where.departmentId = departmentId;
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
        fileAttachments: {
          select: { id: true, fileName: true, fileUrl: true },
        },
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
    const result: FeedbackDetailDto = {
      id: feedback.id,
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
      // statusHistory: feedback.statusHistory.map((h) => ({
      //   status: h.status,
      //   message: h.message,
      //   note: h.note ?? null,
      //   createdAt: h.createdAt.toISOString(),
      // })),
      // forwardingLogs: feedback.forwardingLogs.map((log) => ({
      //   id: log.id,
      //   fromDepartment: log.fromDepartment,
      //   toDepartment: log.toDepartment,
      //   message: log.message,
      //   createdAt: log.createdAt.toISOString(),
      // })),
      fileAttachments: feedback.fileAttachments,
    };

    return result;
  }
}
