/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
   * Retreives trending issues with custom sorting:
   * 1. sentimentLabel: Tiêu cực > Tích cực > Trung lập.
   * 2. engagementScore (reactionCount + commentCount) descending.
   * 3. postedAt descending.
   */
  async getTrendingIssues(dto: GetTrendingIssuesDto) {
    const { page = 1, limit = 10, topic, sentimentLabel } = dto;
    const skip = (page - 1) * limit;

    const dateFilter = this.getDateFilter(dto);

    // 1. build where clause for Prisma count
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(topic && { topic: { contains: topic, mode: 'insensitive' } }),
      ...(sentimentLabel && { sentimentLabel }),
      ...(dateFilter && { postedAt: dateFilter }),
    };

    // 2. build Raw SQL to handle custom sorting logic
    const whereConditions: string[] = [];
    const params: any[] = [];

    if (topic) {
      whereConditions.push(`topic ILIKE $${params.length + 1}`);
      params.push(`%${topic}%`);
    }

    if (sentimentLabel) {
      whereConditions.push(`sentiment_label = $${params.length + 1}`);
      params.push(sentimentLabel);
    }

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
      SELECT *
      FROM dashboard_trending_issues
      ${whereClause}
      ORDER BY 
        CASE sentiment_label 
          WHEN 'Tiêu cực' THEN 1 
          WHEN 'Tích cực' THEN 2 
          WHEN 'Trung lập' THEN 3 
          ELSE 4 
        END ASC,
        engagement_score DESC,
        posted_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const [total, rawData] = await Promise.all([
      this.prisma.dashboardTrendingIssues.count({ where }),
      this.prisma.$queryRawUnsafe<any[]>(query, ...params, limit, skip),
    ]);

    // 4. Map raw data to expected format, ensuring all fields are present and correctly typed
    const data = rawData.map((item) => ({
      postId: item.post_id || item.postId,
      author: item.author,
      content: item.content,
      postLink: item.post_link || item.postLink,
      postedAt: item.posted_at || item.postedAt,
      reactionCount: Number(item.reaction_count || item.reactionCount || 0),
      commentCount: Number(item.comment_count || item.commentCount || 0),
      engagementScore: Number(
        item.engagement_score || item.engagementScore || 0,
      ),
      topic: item.topic,
      sentimentScore: Number(item.sentiment_score || item.sentimentScore || 0),
      aiSummary: item.ai_summary || item.aiSummary,
      sentimentLabel: item.sentiment_label || item.sentimentLabel,
      analyzedAt: item.analyzed_at || item.analyzedAt,
    }));

    return {
      results: data,
      total: total,
    };
  }

  async getClassificationSentiment(dto: GetTrendingIssuesDto) {
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
      sentiment_label as "sentimentLabel",
      COUNT(*) as "count"
    FROM dashboard_trending_issues
    ${whereClause}
    GROUP BY sentiment_label
  `;

    const results: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    const defaultLabels = ['Tích cực', 'Tiêu cực', 'Trung lập'];
    const mapped: Record<string, number> = Object.fromEntries(
      defaultLabels.map((l) => [l, 0]),
    );

    results.forEach((r) => {
      if (mapped.hasOwnProperty(r.sentimentLabel)) {
        mapped[r.sentimentLabel] = Number(r.count);
      }
    });

    return Object.entries(mapped).map(([sentimentLabel, count]) => ({
      sentimentLabel,
      count,
    }));
  }

  async getPostCountByDate(dto: GetTrendingIssuesDto) {
    const whereConditions: string[] = [];
    const params: any[] = [];
    whereConditions.push(`sentiment_label IN ('Tích cực', 'Tiêu cực')`);

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

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const query = `
    SELECT
      TO_CHAR(posted_at, 'YYYY-MM-DD') as "dateStr",
      TO_CHAR(posted_at, 'DD/MM') as "displayDate",
      COUNT(*) as "totalPosts"
    FROM dashboard_trending_issues
    ${whereClause}
    GROUP BY "dateStr", "displayDate"
    ORDER BY "dateStr" ASC
  `;

    const results: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    return results.map((item) => ({
      dateStr: item.dateStr,
      displayDate: item.displayDate,
      totalPosts: Number(item.totalPosts),
    }));
  }
  async getPostsBySentiment(dto: GetTrendingIssuesDto) {
    const whereConditions: string[] = [];
    const params: any[] = [];

    whereConditions.push(`sentiment_label IN ('Tiêu cực', 'Tích cực')`);

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

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const query = `
    SELECT *
    FROM dashboard_trending_issues
    ${whereClause}
    ORDER BY
      CASE sentiment_label
        WHEN 'Tiêu cực' THEN 1
        WHEN 'Tích cực' THEN 2
        ELSE 3
      END ASC,
      engagement_score DESC,
      posted_at DESC
  `;

    const rawData = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);

    return rawData.map((item) => ({
      postId: item.post_id || item.postId,
      author: item.author,
      content: item.content,
      postLink: item.post_link || item.postLink,
      postedAt: item.posted_at || item.postedAt,
      reactionCount: Number(item.reaction_count || item.reactionCount || 0),
      commentCount: Number(item.comment_count || item.commentCount || 0),
      engagementScore: Number(
        item.engagement_score || item.engagementScore || 0,
      ),
      topic: item.topic,
      sentimentScore: Number(item.sentiment_score || item.sentimentScore || 0),
      aiSummary: item.ai_summary || item.aiSummary,
      sentimentLabel: item.sentiment_label || item.sentimentLabel,
      analyzedAt: item.analyzed_at || item.analyzedAt,
    }));
  }
  async getTopicSentimentDistribution(dto: GetTrendingIssuesDto) {
    const dateFilter = this.getDateFilter(dto);
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(dateFilter && { postedAt: dateFilter }),
      sentimentLabel: { in: ['Tích cực', 'Tiêu cực'] }, // ← thêm dòng này
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
}
