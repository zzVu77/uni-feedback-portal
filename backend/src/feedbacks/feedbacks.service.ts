import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  GetMyFeedbacksResponseDto,
  QueryMyFeedbacksDto,
} from './dto/query-my-feedbacks.dto';

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
}
