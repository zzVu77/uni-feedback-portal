import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma, FeedbackStatus, UserRole } from '@prisma/client';
import {
  FeedbackSummary,
  GetMyFeedbacksResponseDto,
  QueryFeedbacksDto,
  FeedbackDetail,
  FeedbackParamDto,
} from './dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Injectable()
export class FeedbacksService {
  constructor(private readonly prisma: PrismaService) {}

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

    const where: Prisma.FeedbacksWhereInput = {};

    // Apply role-based filters
    switch (actor.role) {
      case UserRole.STUDENT:
        where.userId = actor.sub;
        break;
      case UserRole.DEPARTMENT_STAFF:
        // Staff can only see feedbacks in their department
        where.departmentId = actor.departmentId;
        break;
      case UserRole.ADMIN:
        // Admin can see all, but can still filter by department if provided in query
        if (departmentId) {
          where.departmentId = departmentId;
        }
        break;
      default:
        // Deny access for any other roles by default
        throw new ForbiddenException(
          'You do not have permission to access this resource.',
        );
    }

    // Apply additional query filters
    if (status) where.currentStatus = status;
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

    const [items, total] = await Promise.all([
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

    const results = items.map((f) => ({
      id: f.id,
      subject: f.subject,
      location: f.location ? f.location : null,
      currentStatus: f.currentStatus,
      isPrivate: f.isPrivate,
      department: f.department,
      category: f.category,
      createdAt: f.createdAt.toISOString(),
      ...(f.isPrivate &&
      actor.role !== UserRole.STUDENT &&
      f.userId !== actor.sub
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
    actor: ActiveUserData,
  ): Promise<FeedbackDetail> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
      include: {
        user: true,
        forumPost: { select: { id: true } },
        department: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        statusHistory: {
          select: { status: true, message: true, note: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
        forwardingLogs: {
          select: {
            id: true,
            message: true,
            createdAt: true,
            fromDepartment: { select: { id: true, name: true } },
            toDepartment: { select: { id: true, name: true } },
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

    // Apply role-based access control
    switch (actor.role) {
      case UserRole.STUDENT:
        if (feedback.userId !== actor.sub) {
          throw new ForbiddenException('You can only view your own feedback.');
        }
        break;
      case UserRole.DEPARTMENT_STAFF:
        if (feedback.departmentId !== actor.departmentId) {
          throw new ForbiddenException(
            'You can only view feedback in your department.',
          );
        }
        break;
      case UserRole.ADMIN:
        // Admin can view all feedbacks
        break;
      default:
        throw new ForbiddenException(
          'You do not have permission to access this resource.',
        );
    }

    // Map data to FeedbackDetail DTO
    const result: FeedbackDetail = {
      id: feedback.id,
      subject: feedback.subject,
      description: feedback.description,
      location: feedback.location ? feedback.location : null,
      currentStatus: feedback.currentStatus,
      isPrivate: feedback.isPrivate,
      createdAt: feedback.createdAt.toISOString(),
      ...(feedback.isPrivate &&
      actor.role !== UserRole.STUDENT &&
      feedback.userId !== actor.sub
        ? {}
        : {
            student: {
              id: feedback.user.id,
              fullName: feedback.user.fullName,
              email: feedback.user.email,
            },
          }),
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

  async updateFeedback(
    params: FeedbackParamDto,
    dto: UpdateFeedbackDto,
    userId: string,
  ): Promise<FeedbackDetail> {
    const { feedbackId } = params;

    // Find the existing feedback
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, userId },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }

    // Check if feedback is in PENDING status
    if (feedback.currentStatus !== FeedbackStatus.PENDING) {
      throw new ForbiddenException(
        'Feedback can only be updated when in PENDING status.',
      );
    }

    // Validate department and category if they are being updated
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

    // Handle file attachments update
    if (dto.fileAttachments) {
      const existingFiles =
        await this.prisma.fileAttachmentForFeedback.findMany({
          where: { feedbackId: feedbackId },
        });

      const newFileUrls = dto.fileAttachments.map((f) => f.fileUrl);

      // Identify files to delete
      const filesToDelete = existingFiles.filter(
        (f) => !newFileUrls.includes(f.fileUrl),
      );

      // Identify files to add
      const filesToAdd = dto.fileAttachments.filter(
        (f) => !existingFiles.some((e) => e.fileUrl === f.fileUrl),
      );

      if (filesToDelete.length > 0) {
        await this.prisma.fileAttachmentForFeedback.deleteMany({
          where: { id: { in: filesToDelete.map((f) => f.id) } },
        });
      }

      if (filesToAdd.length > 0) {
        await this.prisma.fileAttachmentForFeedback.createMany({
          data: filesToAdd.map((f) => ({
            feedbackId: feedbackId,
            fileName: f.fileName,
            fileUrl: f.fileUrl,
          })),
        });
      }
    }

    // Update feedback scalar fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fileAttachments, ...updateData } = dto;
    const updatedFeedback = await this.prisma.feedbacks.update({
      where: { id: feedbackId },
      data: updateData,
      include: {
        department: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        statusHistory: {
          select: { status: true, message: true, note: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
        forwardingLogs: {
          select: {
            id: true,
            message: true,
            createdAt: true,
            fromDepartment: { select: { id: true, name: true } },
            toDepartment: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        fileAttachments: {
          select: { id: true, fileName: true, fileUrl: true },
        },
      },
    });

    // Return detail
    return {
      id: updatedFeedback.id,
      subject: updatedFeedback.subject,
      description: updatedFeedback.description,
      location: updatedFeedback.location ? updatedFeedback.location : null,
      currentStatus: updatedFeedback.currentStatus,
      isPrivate: updatedFeedback.isPrivate,
      createdAt: updatedFeedback.createdAt.toISOString(),
      department: {
        id: updatedFeedback.department.id,
        name: updatedFeedback.department.name,
      },
      category: {
        id: updatedFeedback.category.id,
        name: updatedFeedback.category.name,
      },
      statusHistory: updatedFeedback.statusHistory.map((h) => ({
        status: h.status,
        message: h.message,
        note: h.note,
        createdAt: h.createdAt.toISOString(),
      })),
      forwardingLogs: updatedFeedback.forwardingLogs.map((log) => ({
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
      fileAttachments: updatedFeedback.fileAttachments.map((a) => ({
        id: a.id,
        fileName: a.fileName,
        fileUrl: a.fileUrl,
      })),
    };
  }

  async deleteFeedback(
    params: FeedbackParamDto,
    userId: string,
  ): Promise<void> {
    const { feedbackId } = params;

    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, userId },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }

    if (feedback.currentStatus !== FeedbackStatus.PENDING) {
      throw new ForbiddenException(
        'Feedback can only be deleted when in PENDING status.',
      );
    }

    await this.prisma.feedbacks.delete({
      where: { id: feedbackId, userId },
    });
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
    if (category.isActive === true) {
      throw new ForbiddenException(
        'You cannot create feedback under an inactive category.',
      );
    }
    if (department.isActive === false) {
      throw new ForbiddenException(
        'You cannot create feedback to an inactive department.',
      );
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
