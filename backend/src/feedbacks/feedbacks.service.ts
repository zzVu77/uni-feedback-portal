import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  FeedbackSummary,
  GetMyFeedbacksResponseDto,
  QueryMyFeedbacksDto,
  FeedbackDetail,
  GetFeedbackParamDto,
} from './dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { SearchMyFeedbacksDto } from './dto/search-my-feedbacks.dto';

@Injectable()
export class FeedbacksService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyFeedbacks(
    query: QueryMyFeedbacksDto,
    userId: number,
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
      userId,
      ...(status && { currentStatus: status }),
      ...(categoryId && { categoryId }),
      ...(departmentId && { departmentId }),
      ...(from || to
        ? {
            createdAt: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
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

    const [items, total] = await Promise.all([
      this.prisma.feedbacks.findMany({
        where: whereClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          feedbackId: true,
          subject: true,
          currentStatus: true,
          isPrivate: true,
          department: {
            select: { departmentId: true, departmentName: true },
          },
          category: { select: { categoryId: true, categoryName: true } },
          createdAt: true,
        },
      }),
      this.prisma.feedbacks.count({ where: whereClause }),
    ]);

    return {
      results: items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
      total,
    };
  }
  async getFeedbackDetail(
    params: GetFeedbackParamDto,
    userId: number,
  ): Promise<FeedbackDetail> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { feedbackId },
      include: {
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

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found`);
    }

    // 🧩 Authorization check: Students can only view their own feedback
    if (feedback.userId !== userId) {
      throw new ForbiddenException('You are not allowed to view this feedback');
    }

    // 🏗️ Map data to FeedbackDetail DTO
    const result: FeedbackDetail = {
      feedbackId: feedback.feedbackId,
      subject: feedback.subject,
      description: feedback.description,
      currentStatus: feedback.currentStatus,
      isPrivate: feedback.isPrivate,
      createdAt: feedback.createdAt.toISOString(),
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
  async createFeedback(
    dto: CreateFeedbackDto,
    userId: number,
  ): Promise<FeedbackSummary> {
    // Check if department and category exist
    const [department, category] = await Promise.all([
      this.prisma.departments.findUnique({
        where: { departmentId: dto.departmentId },
      }),
      this.prisma.categories.findUnique({
        where: { categoryId: dto.categoryId },
      }),
    ]);

    if (!department) {
      throw new NotFoundException('Department not found');
    }
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Create new feedback
    const feedback = await this.prisma.feedbacks.create({
      data: {
        // feedbackId: 11, // Auto-increment
        subject: dto.subject,
        description: dto.description,
        departmentId: dto.departmentId,
        categoryId: dto.categoryId,
        isPrivate: dto.isPrivate,
        userId: userId,
        currentStatus: 'PENDING',
        createdAt: new Date(), //Fix later
        fileAttachments: {
          create: dto.fileAttachments?.map((f) => ({
            fileName: f.fileName,
            fileUrl: f.fileUrl,
          })),
        },
      },
      include: {
        department: true,
        category: true,
      },
    });

    // Return summary
    return {
      feedbackId: feedback.feedbackId,
      subject: feedback.subject,
      currentStatus: feedback.currentStatus,
      isPrivate: feedback.isPrivate,
      department: {
        departmentId: feedback.department.departmentId,
        departmentName: feedback.department.departmentName,
      },
      category: {
        categoryId: feedback.category.categoryId,
        categoryName: feedback.category.categoryName,
      },
      createdAt: feedback.createdAt.toISOString(),
    };
  }
  async searchMyFeedbacks(
    query: SearchMyFeedbacksDto,
    userId: number,
  ): Promise<GetMyFeedbacksResponseDto> {
    const { status, categoryId, departmentId, from, to, q } = query;
    // Implementation here
    const whereClause: Prisma.FeedbacksWhereInput = {
      userId,
      ...(status && { currentStatus: status }),
      ...(categoryId && { categoryId }),
      ...(departmentId && { departmentId }),
      ...(from || to
        ? {
            createdAt: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
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
    const [items, total] = await Promise.all([
      this.prisma.feedbacks.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        select: {
          feedbackId: true,
          subject: true,
          currentStatus: true,
          isPrivate: true,
          department: {
            select: { departmentId: true, departmentName: true },
          },
          category: { select: { categoryId: true, categoryName: true } },
          createdAt: true,
        },
      }),
      this.prisma.feedbacks.count({ where: whereClause }),
    ]);
    return {
      results: items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
      total,
    };
  }
}
