// src/modules/social_listening/social_listening.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetTrendingIssuesDto } from './dto/get-trending-issues.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SocialListeningService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateFilter(
    dto: GetTrendingIssuesDto,
  ): Prisma.DateTimeFilter | undefined {
    if (!dto.startDate && !dto.endDate) return undefined;

    return {
      ...(dto.startDate && { gte: new Date(dto.startDate) }),
      ...(dto.endDate && {
        lt: new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      }),
    };
  }

  /**
   * Retrieves trending issues with dynamic filtering and pagination.
   * Sorting: engagementScore DESC (primary), postedAt DESC (secondary).
   */
  async getTrendingIssues(dto: GetTrendingIssuesDto) {
    const { page = 1, limit = 10, topic, sentimentLabel } = dto;
    const skip = (page - 1) * limit;

    const dateFilter = this.getDateFilter(dto);

    // Build dynamic where clause
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(topic && { topic: { contains: topic, mode: 'insensitive' } }),
      ...(sentimentLabel && { sentimentLabel }),
      ...(dateFilter && { postedAt: dateFilter }),
    };

    // Execute count and data fetch in parallel
    const [total, data] = await Promise.all([
      this.prisma.dashboardTrendingIssues.count({ where }),
      this.prisma.dashboardTrendingIssues.findMany({
        where,
        orderBy: [{ engagementScore: 'desc' }, { postedAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      results: data,
      total: total,
    };
  }
}
