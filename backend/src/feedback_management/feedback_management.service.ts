import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryManageFeedbacksDto } from './dto/query-manage-feedbacks.dto';
import { Prisma } from '@prisma/client';
import { ListFeedbacksResponseDto } from './dto/feedback_management_response.dto';
@Injectable()
export class FeedbackManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFeedbacks(
    query: QueryManageFeedbacksDto,
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
      student: {
        userId: f.user.userId,
        fullName: f.user.fullName,
        email: f.user.email,
      },
    }));

    return { items, total };
  }
}
