/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
   * Retrieves KPI Overview for social listening.
   */
  async getKPIOverview(dto: GetTrendingIssuesDto) {
    const dateFilter = this.getDateFilter(dto);
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(dateFilter && { postedAt: dateFilter }),
    };

    const [aggregate, sentimentGroups] = await Promise.all([
      this.prisma.dashboardTrendingIssues.aggregate({
        where,
        _count: { postId: true },
        _sum: {
          reactionCount: true,
          commentCount: true,
        },
      }),
      this.prisma.dashboardTrendingIssues.groupBy({
        where,
        by: ['sentimentLabel'],
        _count: { postId: true },
      }),
    ]);

    const totalPosts = aggregate._count.postId || 0;
    const counts: Record<string, number> = {
      'Tích cực': 0,
      'Tiêu cực': 0,
      'Trung lập': 0,
    };

    sentimentGroups.forEach((group) => {
      if (counts.hasOwnProperty(group.sentimentLabel)) {
        counts[group.sentimentLabel] = group._count.postId;
      }
    });

    // Find dominant sentiment
    let dominantSentiment = 'Chưa rõ';
    let maxCount = 0;

    for (const [label, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantSentiment = label;
      }
    }

    const percentage =
      totalPosts > 0 ? Math.round((maxCount / totalPosts) * 100) : 0;
    const sentimentTrendText =
      totalPosts > 0
        ? `Chiếm ${percentage}% tổng số bài đăng`
        : 'Chưa có dữ liệu bài đăng';

    return {
      totalPosts,
      totalReactions: aggregate._sum.reactionCount || 0,
      totalComments: aggregate._sum.commentCount || 0,
      negativePostsCount: counts['Tiêu cực'],
      dominantSentiment,
      sentimentTrendText,
    };
  }

  /**
   * Retrieves sentiment trend grouped by date.
   */
  async getSentimentTrend(dto: GetTrendingIssuesDto) {
    // Using raw query for grouping by date string in Postgres
    // We need to handle parameters for the where clause safely
    const whereConditions: string[] = [];
    const params: any[] = [];

    if (dto.startDate) {
      whereConditions.push(`posted_at >= $${params.length + 1}`);
      params.push(new Date(dto.startDate));
    }

    if (dto.endDate) {
      whereConditions.push(`posted_at < $${params.length + 1}`);
      params.push(
        new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      );
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    const query = `
      SELECT 
        TO_CHAR(posted_at, 'YYYY-MM-DD') as "dateStr",
        TO_CHAR(posted_at, 'DD/MM') as "displayDate",
        COUNT(*) FILTER (WHERE sentiment_label = 'Tích cực') as positive,
        COUNT(*) FILTER (WHERE sentiment_label = 'Tiêu cực') as negative,
        COUNT(*) FILTER (WHERE sentiment_label = 'Trung lập') as neutral
      FROM dashboard_trending_issues
      ${whereClause}
      GROUP BY "dateStr", "displayDate"
      ORDER BY "dateStr" ASC
    `;

    const results: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    return results.map((item) => ({
      dateStr: item.dateStr,
      displayDate: item.displayDate,
      positive: Number(item.positive),
      negative: Number(item.negative),
      neutral: Number(item.neutral),
    }));
  }

  /**
   * Retrieves topic distribution.
   */
  async getTopicDistribution(dto: GetTrendingIssuesDto) {
    const dateFilter = this.getDateFilter(dto);
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(dateFilter && { postedAt: dateFilter }),
    };

    const groups = await this.prisma.dashboardTrendingIssues.groupBy({
      where,
      by: ['topic'],
      _count: { postId: true },
      orderBy: {
        _count: {
          postId: 'desc',
        },
      },
      take: 10,
    });

    return groups.map((g) => ({
      topic: g.topic,
      count: g._count.postId,
    }));
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
