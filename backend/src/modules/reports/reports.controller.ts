// src/modules/reports/reports.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard'; // Giả sử bạn có guard này
import { ReportFilterDto } from './dto/report-filter.dto';
import { ReportsService } from './reports.service';
import {
  StatsOverviewDto,
  TopDepartmentStatsDto,
  FeedbackTrendDto,
  TopInteractivePostDto,
  RadarStatsDto,
} from './dto/report-response.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@ApiTags('Admin Reports')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN) // Chỉ Admin mới xem được
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('admin/overview')
  @ApiOperation({
    summary: 'Get general feedback statistics (Counts by status)',
  })
  @ApiResponse({ status: 200, type: StatsOverviewDto })
  async getOverview(@Query() query: ReportFilterDto) {
    return this.reportsService.getGeneralOverview(query);
  }

  @Get('admin/departments')
  @ApiOperation({
    summary: 'Get performance stats by department (Volume & Resolution Time)',
  })
  @ApiResponse({ status: 200, type: [TopDepartmentStatsDto] })
  async getDepartmentStats(@Query() query: ReportFilterDto) {
    return this.reportsService.getTopDepartments(query);
  }

  @Get('admin/trends')
  @ApiOperation({ summary: 'Get feedback volume trends over time' })
  @ApiResponse({ status: 200, type: [FeedbackTrendDto] })
  async getTrends(@Query() query: ReportFilterDto) {
    return this.reportsService.getFeedbackTrends(query);
  }

  @Get('admin/categories')
  @ApiOperation({ summary: 'Get top 5 categories with most feedbacks' })
  async getTopCategories(@Query() query: ReportFilterDto) {
    return this.reportsService.getTopCategories(query);
  }

  @Get('admin/top-interactive-posts')
  @ApiOperation({
    summary: 'Get top 5 forum posts with most interactions (votes + comments)',
  })
  @ApiResponse({ status: 200, type: [TopInteractivePostDto] })
  async getTopInteractivePosts(@Query() query: ReportFilterDto) {
    return this.reportsService.getTopInteractivePosts(query);
  }

  // 1. Tổng quan số liệu (Staff)
  @Get('staff/overview')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Get overview stats for current department' })
  @ApiResponse({ status: 200, type: StatsOverviewDto })
  async getStaffOverview(
    @Query() query: ReportFilterDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.reportsService.getStaffOverview(query, actor.departmentId!);
  }

  // 2. Top Category (Staff)
  @Get('staff/categories')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Get top categories for current department' })
  async getStaffTopCategories(
    @Query() query: ReportFilterDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.reportsService.getStaffTopCategories(
      query,
      actor.departmentId!,
    );
  }

  // 3. Trends (Staff)
  @Get('staff/trends')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Get feedback trends for current department' })
  @ApiResponse({ status: 200, type: [FeedbackTrendDto] })
  async getStaffTrends(
    @Query() query: ReportFilterDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.reportsService.getStaffFeedbackTrends(
      query,
      actor.departmentId!,
    );
  }

  // 4. Performance (Staff)
  @Get('staff/performance')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Get performance metrics for current department' })
  @ApiResponse({ status: 200, type: TopDepartmentStatsDto })
  async getStaffPerformance(
    @Query() query: ReportFilterDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.reportsService.getStaffPerformance(query, actor.departmentId!);
  }

  // 5. Radar Chart (Staff)
  @Get('staff/radar-chart')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({
    summary: 'Get data for Radar Chart (Resolved vs Unresolved)',
  })
  @ApiResponse({ status: 200, type: [RadarStatsDto] })
  async getStaffRadarChart(
    @Query() query: ReportFilterDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.reportsService.getStaffRadarChart(query, actor.departmentId!);
  }
}
