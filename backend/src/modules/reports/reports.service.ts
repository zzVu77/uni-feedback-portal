/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  RadarStatsDto,
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

  // 1. Staff Overview
  async getStaffOverview(
    dto: ReportFilterDto,
    departmentId: string,
  ): Promise<StatsOverviewDto> {
    const dateFilter = this.getDateFilter(dto);

    // Thêm điều kiện departmentId
    const where: Prisma.FeedbacksWhereInput = {
      ...dateFilter,
      departmentId: departmentId,
    };

    const groups = await this.prisma.feedbacks.groupBy({
      by: ['currentStatus'],
      where: where,
      _count: { _all: true },
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

  // 2. Staff Top Categories
  async getStaffTopCategories(dto: ReportFilterDto, departmentId: string) {
    const dateFilter = this.getDateFilter(dto);
    const where: Prisma.FeedbacksWhereInput = {
      ...dateFilter,
      departmentId: departmentId,
    };

    const result = await this.prisma.feedbacks.groupBy({
      by: ['categoryId'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
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

  // 3. Staff Trends
  async getStaffFeedbackTrends(
    dto: ReportFilterDto,
    departmentId: string,
  ): Promise<FeedbackTrendDto[]> {
    const fromDate = dto.from
      ? new Date(dto.from)
      : new Date(new Date().setDate(new Date().getDate() - 30));
    const toDate = dto.to
      ? new Date(new Date(dto.to).setDate(new Date(dto.to).getDate() + 1))
      : new Date();

    // FIX: Thêm ::uuid sau biến ${departmentId}
    const trends: any[] = await this.prisma.$queryRaw`
      SELECT 
        TO_CHAR(f."createdAt", 'YYYY-MM-DD') as date,
        COUNT(f.id)::int as count
      FROM "Feedbacks" f
      WHERE f."departmentId" = ${departmentId}::uuid 
        AND f."createdAt" >= ${fromDate} 
        AND f."createdAt" < ${toDate}
      GROUP BY TO_CHAR(f."createdAt", 'YYYY-MM-DD')
      ORDER BY date ASC;
    `;

    return trends;
  }

  // 4. Staff Performance
  async getStaffPerformance(
    dto: ReportFilterDto,
    departmentId: string,
  ): Promise<TopDepartmentStatsDto> {
    const fromDate = dto.from ? new Date(dto.from) : new Date('2000-01-01');
    const toDate = dto.to
      ? new Date(new Date(dto.to).setDate(new Date(dto.to).getDate() + 1))
      : new Date();

    // FIX: Thêm ::uuid sau biến ${departmentId} ở điều kiện WHERE d.id
    const rawData: any[] = await this.prisma.$queryRaw`
      SELECT 
        d.id as "departmentId",
        d.name as "departmentName",
        COUNT(f.id)::int as "feedbackCount",
        COUNT(CASE WHEN f."currentStatus" IN ('PENDING', 'IN_PROGRESS') THEN 1 END)::int as "unresolvedCount",
        COUNT(CASE WHEN f."currentStatus" IN ('RESOLVED', 'REJECTED') THEN 1 END)::int as "resolvedCount",
        COALESCE(
          AVG(
            EXTRACT(EPOCH FROM (h."createdAt" - f."createdAt")) / 3600
          ) FILTER (WHERE h.status = 'RESOLVED'), 
          0
        )::float as "avgResolutionTimeHours"
      FROM "Departments" d
      LEFT JOIN "Feedbacks" f ON f."departmentId" = d.id AND f."createdAt" >= ${fromDate} AND f."createdAt" < ${toDate}
      LEFT JOIN "FeedbackStatusHistory" h ON f.id = h."feedbackId" AND h.status = 'RESOLVED'
      WHERE d.id = ${departmentId}::uuid
      GROUP BY d.id, d.name;
    `;

    return rawData[0] || null;
  }
  // 5. Staff Radar Chart
  async getStaffRadarChart(
    dto: ReportFilterDto,
    departmentId: string,
  ): Promise<RadarStatsDto[]> {
    // 1. Xác định Năm cần thống kê
    // Lấy năm từ ngày 'to' (hoặc ngày hiện tại nếu không có filter)
    // Ví dụ: User chọn range T2/2025 -> T4/2025 => Lấy dữ liệu cả năm 2025
    const targetDate = dto.to ? new Date(dto.to) : new Date();
    const year = targetDate.getFullYear();

    // Tạo mốc thời gian đầu năm và đầu năm sau
    const startOfYear = new Date(year, 0, 1); // 01/01/YYYY
    const endOfYear = new Date(year + 1, 0, 1); // 01/01/(YYYY+1)

    // 2. Query DB (Vẫn giữ ::uuid để tránh lỗi)
    const rawData: any[] = await this.prisma.$queryRaw`
      SELECT
        EXTRACT(MONTH FROM f."createdAt")::int as "monthNum",
        COUNT(CASE WHEN f."currentStatus" IN ('RESOLVED', 'REJECTED') THEN 1 END)::int as "resolved",
        COUNT(CASE WHEN f."currentStatus" IN ('PENDING', 'IN_PROGRESS') THEN 1 END)::int as "unresolved"
      FROM "Feedbacks" f
      WHERE f."departmentId" = ${departmentId}::uuid
        AND f."createdAt" >= ${startOfYear} 
        AND f."createdAt" < ${endOfYear}
      GROUP BY "monthNum"
      ORDER BY "monthNum" ASC;
    `;

    // 3. Chuẩn hóa dữ liệu cho đủ 12 tháng
    const fullYearData: RadarStatsDto[] = [];
    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    for (let i = 0; i < 12; i++) {
      const foundMonth = rawData.find((r) => r.monthNum === i + 1);

      fullYearData.push({
        month: monthNames[i],
        resolved: foundMonth ? foundMonth.resolved : 0,
        unresolved: foundMonth ? foundMonth.unresolved : 0,
      });
    }

    return fullYearData;
  }
}
