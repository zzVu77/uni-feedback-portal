/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { Prisma } from '@prisma/client';
import {
  StatsOverviewDto,
  TopDepartmentStatsDto,
  FeedbackTrendDto,
  TopInteractivePostDto,
} from './dto/report-response.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper để tạo where clause cho date range
  private getDateFilter(dto: ReportFilterDto): Prisma.FeedbacksWhereInput {
    if (!dto.from && !dto.to) return {};
    return {
      createdAt: {
        ...(dto.from && { gte: new Date(dto.from) }),
        ...(dto.to && {
          lt: new Date(
            new Date(dto.to).setDate(new Date(dto.to).getDate() + 1),
          ),
        }),
      },
    };
  }

  // 1. Tổng quan số liệu (Pie Chart / Cards)
  async getGeneralOverview(dto: ReportFilterDto): Promise<StatsOverviewDto> {
    const where = this.getDateFilter(dto);

    // Group by status để đếm 1 lần query
    const groups = await this.prisma.feedbacks.groupBy({
      by: ['currentStatus'],
      where: where,
      _count: {
        _all: true,
      },
    });

    const result = {
      totalFeedbacks: 0,
      pendingCount: 0,
      inProgressCount: 0,
      resolvedCount: 0,
      rejectedCount: 0,
    };

    groups.forEach((g) => {
      result.totalFeedbacks += g._count._all;
      if (g.currentStatus === 'PENDING') result.pendingCount = g._count._all;
      if (g.currentStatus === 'IN_PROGRESS')
        result.inProgressCount = g._count._all;
      if (g.currentStatus === 'RESOLVED') result.resolvedCount = g._count._all;
      if (g.currentStatus === 'REJECTED') result.rejectedCount = g._count._all;
    });

    return result;
  }

  // 2. Top performing Departments
  async getTopDepartments(
    dto: ReportFilterDto,
  ): Promise<TopDepartmentStatsDto[]> {
    const fromDate = dto.from ? new Date(dto.from) : new Date('2000-01-01');
    const toDate = dto.to
      ? new Date(new Date(dto.to).setDate(new Date(dto.to).getDate() + 1))
      : new Date();

    const rawData: any[] = await this.prisma.$queryRaw`
      SELECT 
        d.name as "departmentName",
        d.id as "departmentId",
        COUNT(f.id)::int as "feedbackCount",
        COUNT(CASE WHEN f."currentStatus" IN ('PENDING', 'IN_PROGRESS') THEN 1 END)::int as "unresolvedCount",
        COUNT(CASE WHEN f."currentStatus" IN ('RESOLVED', 'REJECTED') THEN 1 END)::int as "resolvedCount",
        COALESCE(
          AVG(
            EXTRACT(EPOCH FROM (h."createdAt" - f."createdAt")) / 3600
          ) FILTER (WHERE h.status = 'RESOLVED'), 
          0
        )::float as "avgResolutionTimeHours"
      FROM "Feedbacks" f
      JOIN "Departments" d ON f."departmentId" = d.id
      LEFT JOIN "FeedbackStatusHistory" h ON f.id = h."feedbackId" AND h.status = 'RESOLVED'
      WHERE f."createdAt" >= ${fromDate} AND f."createdAt" < ${toDate}
      GROUP BY d.id, d.name
      ORDER BY "feedbackCount" DESC
      LIMIT 10;
    `;

    return rawData;
  }

  // 3. Feedback Trends (Line Chart)
  async getFeedbackTrends(dto: ReportFilterDto): Promise<FeedbackTrendDto[]> {
    const fromDate = dto.from
      ? new Date(dto.from)
      : new Date(new Date().setDate(new Date().getDate() - 30)); // Mặc định 30 ngày
    const toDate = dto.to
      ? new Date(new Date(dto.to).setDate(new Date(dto.to).getDate() + 1))
      : new Date();

    // Group by Date (Postgres specific syntax)
    const trends: any[] = await this.prisma.$queryRaw`
      SELECT 
        TO_CHAR(f."createdAt", 'YYYY-MM-DD') as date,
        COUNT(f.id)::int as count
      FROM "Feedbacks" f
      WHERE f."createdAt" >= ${fromDate} AND f."createdAt" < ${toDate}
      GROUP BY TO_CHAR(f."createdAt", 'YYYY-MM-DD')
      ORDER BY date ASC;
    `;

    return trends;
  }

  // 4. Top Category (Bar Chart) - Đã sửa lỗi Type
  async getTopCategories(dto: ReportFilterDto) {
    const where = this.getDateFilter(dto);

    const result = await this.prisma.feedbacks.groupBy({
      by: ['categoryId'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    const categoryIds = result.map((r) => r.categoryId);

    const categories = await this.prisma.categories.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    return result.map((r) => ({
      categoryName:
        categories.find((c) => c.id === r.categoryId)?.name || 'Unknown',
      count: r._count.id,
      categoryId: r.categoryId,
    }));
  }

  // 5. Top bài đăng có tương tác cao nhất (Votes + Comments)
  async getTopInteractivePosts(
    dto: ReportFilterDto,
  ): Promise<TopInteractivePostDto[]> {
    const fromDate = dto.from
      ? new Date(dto.from)
      : new Date(new Date().setDate(new Date().getDate() - 30));
    const toDate = dto.to
      ? new Date(new Date(dto.to).setDate(new Date(dto.to).getDate() + 1))
      : new Date();

    const result: any[] = await this.prisma.$queryRaw`
      SELECT 
        fp.id as "forumPostId",
        f.subject as "title",
        COUNT(DISTINCT v."userId")::int as "voteCount",
        COUNT(DISTINCT c.id)::int as "commentCount",
        (COUNT(DISTINCT v."userId") + COUNT(DISTINCT c.id))::int as "totalInteractions"
      FROM "ForumPosts" fp
      JOIN "Feedbacks" f ON fp."feedbackId" = f.id
      LEFT JOIN "Votes" v ON fp.id = v."postId"
      LEFT JOIN "Comments" c ON fp.id = c."targetId" AND c."targetType" = 'FORUM_POST'
      WHERE fp."createdAt" >= ${fromDate} AND fp."createdAt" < ${toDate}
      GROUP BY fp.id, f.subject
      ORDER BY "totalInteractions" DESC
      LIMIT 5;
    `;

    return result;
  }
}
