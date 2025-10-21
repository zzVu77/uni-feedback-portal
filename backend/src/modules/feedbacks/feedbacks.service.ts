import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  FeedbackSummary,
  GetMyFeedbacksResponseDto,
  QueryFeedbacksDto,
  FeedbackDetail,
  FeedbackParamDto,
} from './dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyFeedbacks(
    query: QueryFeedbacksDto,
    userId: string,
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
    // console.log('whereClause', whereClause);

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
      results: items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
      total,
    };
  }
  async getFeedbackDetail(
    params: FeedbackParamDto,
    userId: string,
  ): Promise<FeedbackDetail> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
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

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found`);
    }

    // 🧩 Authorization check: Students can only view their own feedback
    if (feedback.userId !== userId) {
      throw new ForbiddenException('You are not allowed to view this feedback');
    }

    // 🏗️ Map data to FeedbackDetail DTO
    const result: FeedbackDetail = {
      id: feedback.id,
      subject: feedback.subject,
      description: feedback.description,
      currentStatus: feedback.currentStatus,
      isPrivate: feedback.isPrivate,
      createdAt: feedback.createdAt.toISOString(),
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
        note: h.note,
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
  async createFeedback(
    dto: CreateFeedbackDto,
    userId: string,
  ): Promise<FeedbackSummary> {
    // Check if department and category exist
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

    // Create new feedback
    const feedback = await this.prisma.feedbacks.create({
      data: {
        subject: dto.subject,
        description: dto.description,
        location: dto.location ?? null,
        departmentId: dto.departmentId,
        categoryId: dto.categoryId,
        isPrivate: dto.isPrivate,
        userId: userId,
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
      id: feedback.id,
      subject: feedback.subject,
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
