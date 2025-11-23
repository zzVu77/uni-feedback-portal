import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma, FeedbackStatus, FileTargetType } from '@prisma/client';
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

@Injectable()
export class FeedbacksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
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
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
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
        // Không include fileAttachments ở đây
      },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found`);
    }

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
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }

    if (feedback.currentStatus !== FeedbackStatus.PENDING) {
      throw new ForbiddenException(
        'Feedback can only be updated when in PENDING status.',
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

    // Handle file attachments update using UploadsService
    const updateFileAttachments =
      await this.uploadsService.updateAttachmentsForTarget(
        feedbackId,
        FileTargetType.FEEDBACK,
        dto.fileAttachments ?? [],
      );

    // Update feedback scalar fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fileAttachments, ...updateData } = dto;
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
      },
    });
    const result: FeedbackDetail = {
      id: updateFeedback.id,
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
      statusHistory: updateFeedback.statusHistory.map((h) => ({
        status: h.status,
        message: h.message,
        note: h.note,
        createdAt: h.createdAt.toISOString(),
      })),
      forwardingLogs: updateFeedback.forwardingLogs.map((log) => ({
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
      fileAttachments: updateFileAttachments,
    };
    return result;
    // Return detail
    // return this.getFeedbackDetail(params, userId);
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

    // Xóa file đính kèm trước
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
        ...feedbackData,
        userId: actor.sub,
      },
      include: {
        department: true,
        category: true,
      },
    });

    // Create attachments using UploadsService
    if (fileAttachments && fileAttachments.length > 0) {
      await this.uploadsService.updateAttachmentsForTarget(
        feedback.id,
        FileTargetType.FEEDBACK,
        fileAttachments,
      );
    }

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
