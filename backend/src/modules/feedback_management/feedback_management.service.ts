import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  FeedbackDetailDto,
  ForwardingResponseDto,
  ListFeedbacksResponseDto,
  UpdateFeedbackStatusDto,
  UpdateFeedbackStatusResponseDto,
  CreateForwardingDto,
} from './dto';
import { FeedbackParamDto, QueryFeedbacksDto } from 'src/modules/feedbacks/dto';
import {
  generateForwardingMessage,
  generateStatusUpdateMessage,
} from 'src/shared/helpers/feedback-message.helper';
@Injectable()
export class FeedbackManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFeedbacks(
    query: QueryFeedbacksDto,
    actor: {
      userId: string;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: string;
    },
  ): Promise<ListFeedbacksResponseDto> {
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

    const where: Prisma.FeedbacksWhereInput = {};
    console.log('actor', actor);
    // role-based filter
    if (actor.role === 'DEPARTMENT_STAFF') {
      where.departmentId = actor.departmentId;
    } else if (departmentId) {
      where.departmentId = departmentId;
    }

    // optional filters
    if (status) where.currentStatus = status;
    if (categoryId) where.categoryId = categoryId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    if (q) {
      where.OR = [
        { subject: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    console.log('where', where);

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
      department: {
        id: f.department.id,
        name: f.department.name,
      },
      category: {
        id: f.category.id,
        name: f.category.name,
      },
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
    actor: {
      userId: string;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: string;
    },
  ): Promise<FeedbackDetailDto> {
    const { feedbackId } = params;

    // --- 1️⃣ Lấy feedback theo ID ---
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
      include: {
        user: true, // lấy student info
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

    // --- 2️⃣ Kiểm tra tồn tại ---
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    // --- 3️⃣ Quyền truy cập ---
    // Department staff chỉ xem được feedback thuộc department của mình
    if (
      actor.role === 'DEPARTMENT_STAFF' &&
      feedback.departmentId !== actor.departmentId
    ) {
      throw new ForbiddenException('Access denied to this feedback');
    }

    // --- 4️⃣ Map dữ liệu ra DTO ---
    const result: FeedbackDetailDto = {
      id: feedback.id,
      subject: feedback.subject,
      description: feedback.description,
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
      department: {
        id: feedback.department.id,
        name: feedback.department.name,
      },
      category: {
        id: feedback.category.id,
        name: feedback.category.name,
      },
      statusHistory: feedback.statusHistory.map((h) => ({
        status: h.status,
        message: h.message,
        note: h.note ?? null,
        createdAt: h.createdAt.toISOString(),
      })),
      forwardingLogs: feedback.forwardingLogs.map((log) => ({
        id: log.id,
        fromDepartment: {
          id: log.fromDepartment.id,
          name: log.fromDepartment.name,
        },
        toDepartment: {
          id: log.toDepartment.id,
          name: log.toDepartment.name,
        },
        message: log.message,
        createdAt: log.createdAt.toISOString(),
      })),
      fileAttachments: feedback.fileAttachments.map((a) => ({
        id: a.id,
        fileName: a.fileName,
        fileUrl: a.fileUrl,
      })),
    };

    return result;
  }
  async updateStatus(
    params: FeedbackParamDto,
    dto: UpdateFeedbackStatusDto,
    actor: {
      userId: string;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: string;
    },
  ): Promise<UpdateFeedbackStatusResponseDto> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
      include: { department: true },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (
      actor.role !== 'ADMIN' &&
      feedback.departmentId !== actor.departmentId
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this feedback',
      );
    }

    const updatedFeedback = await this.prisma.feedbacks.update({
      where: { id: feedbackId },
      data: {
        currentStatus: dto.status,
      },
    });

    await this.prisma.feedbackStatusHistory.create({
      data: {
        feedbackId: feedback.id,
        status: dto.status,
        message: generateStatusUpdateMessage(
          feedback.department.name,
          dto.status,
        ),
        note: dto.note ?? null,
        createdAt: new Date(),
      },
    });

    return {
      feedbackId: updatedFeedback.id,
      currentStatus: updatedFeedback.currentStatus,
      updatedAt: new Date().toISOString(),
    };
  }
  async createForwarding(
    feedbackId: string,
    dto: CreateForwardingDto,
    actor: {
      userId: string;
      departmentId: string;
    },
  ): Promise<ForwardingResponseDto> {
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found`);
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

    // 4️⃣ Tạo bản ghi forwarding mới
    const forwarding = await this.prisma.forwardingLogs.create({
      data: {
        feedbackId,
        fromDepartmentId: actor.departmentId,
        toDepartmentId: dto.toDepartmentId,
        userId: actor.userId,
        message: generateForwardingMessage(toDepartment.name),
        createdAt: new Date(),
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
      message: forwarding.message ?? '',
      createdAt: forwarding.createdAt.toISOString(),
    };
  }
}
