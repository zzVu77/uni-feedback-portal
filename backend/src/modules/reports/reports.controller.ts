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
} from './dto/report-response.dto';

@ApiTags('Admin Reports')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN) // Chỉ Admin mới xem được
@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get general feedback statistics (Counts by status)',
  })
  @ApiResponse({ status: 200, type: StatsOverviewDto })
  async getOverview(@Query() query: ReportFilterDto) {
    return this.reportsService.getGeneralOverview(query);
  }

  @Get('departments')
  @ApiOperation({
    summary: 'Get performance stats by department (Volume & Resolution Time)',
  })
  @ApiResponse({ status: 200, type: [TopDepartmentStatsDto] })
  async getDepartmentStats(@Query() query: ReportFilterDto) {
    return this.reportsService.getTopDepartments(query);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get feedback volume trends over time' })
  @ApiResponse({ status: 200, type: [FeedbackTrendDto] })
  async getTrends(@Query() query: ReportFilterDto) {
    return this.reportsService.getFeedbackTrends(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get top 5 categories with most feedbacks' })
  async getTopCategories(@Query() query: ReportFilterDto) {
    return this.reportsService.getTopCategories(query);
  }
}
