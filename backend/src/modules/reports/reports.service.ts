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

  // 2. Top phòng ban & Thời gian xử lý trung bình (Advanced Query)
  async getTopDepartments(
    dto: ReportFilterDto,
  ): Promise<TopDepartmentStatsDto[]> {
    // Lưu ý: Prisma Model map xuống DB thường có dấu "" nếu dùng Postgres
    // Query này tính số lượng feedback và thời gian trung bình (tính bằng giờ) từ lúc tạo đến lúc RESOLVED

    const fromDate = dto.from ? new Date(dto.from) : new Date('2000-01-01');
    const toDate = dto.to
      ? new Date(new Date(dto.to).setDate(new Date(dto.to).getDate() + 1))
      : new Date();

    const rawData: any[] = await this.prisma.$queryRaw`
      SELECT 
        d.name as "departmentName",
        COUNT(f.id)::int as "feedbackCount",
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

  // 3. Biểu đồ xu hướng theo ngày (Line Chart)
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

    // Thay đổi: Dùng id thay vì _all để tránh lỗi TypeScript
    const result = await this.prisma.feedbacks.groupBy({
      by: ['categoryId'],
      where,
      _count: {
        id: true, // Đếm số lượng ID thay vì dùng _all
      },
      orderBy: {
        _count: {
          id: 'desc', // Sắp xếp giảm dần theo số lượng ID
        },
      },
      take: 5,
    });

    // Lấy danh sách ID để query tên category
    const categoryIds = result.map((r) => r.categoryId);

    const categories = await this.prisma.categories.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    return result.map((r) => ({
      // Tìm tên category tương ứng, nếu không thấy thì để Unknown
      categoryName:
        categories.find((c) => c.id === r.categoryId)?.name || 'Unknown',
      count: r._count.id, // Truy cập vào .id thay vì ._all
    }));
  }
}
