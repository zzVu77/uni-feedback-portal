import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  FeedbackDetailDto,
  ForwardingResponseDto,
  ListFeedbacksResponseDto,
  UpdateFeedbackStatusDto,
  UpdateFeedbackStatusResponseDto,
  CreateForwardingDto,
} from './dto';
import { FeedbackParamDto, QueryFeedbacksDto } from 'src/feedbacks/dto';
@Injectable()
export class FeedbackManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFeedbacks(
    query: QueryFeedbacksDto,
    actor: {
      userId: number;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: number;
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
          department: { select: { departmentId: true, departmentName: true } },
          category: { select: { categoryId: true, categoryName: true } },
          user: { select: { userId: true, fullName: true, email: true } },
        },
      }),
      this.prisma.feedbacks.count({ where }),
    ]);

    const items = feedbacks.map((f) => ({
      feedbackId: f.feedbackId,
      subject: f.subject,
      currentStatus: f.currentStatus,
      isPrivate: f.isPrivate,
      department: {
        departmentId: f.department.departmentId,
        departmentName: f.department.departmentName,
      },
      category: {
        categoryId: f.category.categoryId,
        categoryName: f.category.categoryName,
      },
      createdAt: f.createdAt.toISOString(),
      ...(f.isPrivate
        ? {}
        : {
            student: {
              userId: f.user.userId,
              fullName: f.user.fullName,
              email: f.user.email,
            },
          }),
    }));

    return { items, total };
  }
  async getFeedbackDetail(
    params: FeedbackParamDto,
    actor: {
      userId: number;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: number;
    },
  ): Promise<FeedbackDetailDto> {
    const { feedbackId } = params;

    // --- 1️⃣ Lấy feedback theo ID ---
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { feedbackId },
      include: {
        user: true, // lấy student info
        forumPost: {
          select: { postId: true },
        },
        department: {
          select: { departmentId: true, departmentName: true },
        },
        category: {
          select: { categoryId: true, categoryName: true },
        },
        statusHistory: {
          select: {
            status: true,
            message: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        forwardingLogs: {
          select: {
            forwardingLogId: true,
            message: true,
            createdAt: true,
            fromDepartment: {
              select: { departmentId: true, departmentName: true },
            },
            toDepartment: {
              select: { departmentId: true, departmentName: true },
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
      feedbackId: feedback.feedbackId,
      subject: feedback.subject,
      description: feedback.description,
      currentStatus: feedback.currentStatus,
      isPrivate: feedback.isPrivate,
      createdAt: feedback.createdAt.toISOString(),
      ...(feedback.isPrivate
        ? {}
        : {
            student: {
              userId: feedback.user.userId,
              fullName: feedback.user.fullName,
              email: feedback.user.email,
            },
          }),
      forumPost: feedback.forumPost
        ? { postId: feedback.forumPost.postId }
        : undefined,
      department: {
        departmentId: feedback.department.departmentId,
        departmentName: feedback.department.departmentName,
      },
      category: {
        categoryId: feedback.category.categoryId,
        categoryName: feedback.category.categoryName,
      },
      statusHistory: feedback.statusHistory.map((h) => ({
        status: h.status,
        message: h.message,
        createdAt: h.createdAt.toISOString(),
      })),
      forwardingLogs: feedback.forwardingLogs.map((log) => ({
        forwardingLogId: log.forwardingLogId,
        fromDepartment: {
          departmentId: log.fromDepartment.departmentId,
          departmentName: log.fromDepartment.departmentName,
        },
        toDepartment: {
          departmentId: log.toDepartment.departmentId,
          departmentName: log.toDepartment.departmentName,
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
      userId: number;
      role: 'DEPARTMENT_STAFF' | 'ADMIN';
      departmentId: number;
    },
  ): Promise<UpdateFeedbackStatusResponseDto> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { feedbackId: feedbackId },
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
      where: { feedbackId: feedbackId },
      data: {
        currentStatus: dto.status,
      },
    });

    await this.prisma.feedbackStatusHistory.create({
      data: {
        feedbackId: feedback.feedbackId,
        status: dto.status,
        message: dto.message ?? null,
        createdAt: new Date(),
      },
    });

    return {
      feedbackId: updatedFeedback.feedbackId,
      currentStatus: updatedFeedback.currentStatus,
      updatedAt: new Date().toISOString(),
    };
  }
  async createForwarding(
    feedbackId: number,
    dto: CreateForwardingDto,
    actor: {
      userId: number;
      departmentId: number;
    },
  ): Promise<ForwardingResponseDto> {
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { feedbackId },
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
      where: { departmentId: dto.toDepartmentId },
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
        message: dto.message,
        createdAt: new Date(),
      },
      include: {
        fromDepartment: true,
        toDepartment: true,
      },
    });

    await this.prisma.feedbacks.update({
      where: { feedbackId },
      data: {
        departmentId: dto.toDepartmentId,
      },
    });
    return {
      forwardingLogId: forwarding.forwardingLogId,
      feedbackId: forwarding.feedbackId,
      fromDepartment: {
        id: forwarding.fromDepartment.departmentId,
        name: forwarding.fromDepartment.departmentName,
      },
      toDepartment: {
        id: forwarding.toDepartment.departmentId,
        name: forwarding.toDepartment.departmentName,
      },
      message: forwarding.message ?? '',
      createdAt: forwarding.createdAt.toISOString(),
    };
  }
}
