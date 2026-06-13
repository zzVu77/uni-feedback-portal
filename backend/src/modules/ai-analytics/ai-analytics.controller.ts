import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { AiAnalyticsService } from './ai-analytics.service';
import { ReportPeriodType, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TriggerReportDto, GetReportsDto } from './dto/trigger-report.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('AI Analytics')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('ai-analytics')
export class AiAnalyticsController {
  constructor(
    private readonly aiAnalyticsService: AiAnalyticsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('trigger')
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF)
  @ApiOperation({
    summary: 'Manually trigger an AI report generation for a specific period',
    description:
      'This API runs asynchronously. It will return immediately and process the report in the background.',
  })
  @ApiResponse({
    status: 202,
    description: 'Report generation started successfully in the background.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or dates.',
  })
  triggerReport(@Body() body: TriggerReportDto) {
    const { periodType, startDate, endDate } = body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid start or end date');
    }

    // Run in background without await
    if (periodType === ReportPeriodType.WEEKLY) {
      this.aiAnalyticsService.generateWeeklyReport(start, end).catch((err) => {
        console.error('Background Weekly Report Generation Failed:', err);
      });
    } else if (periodType === ReportPeriodType.MONTHLY) {
      this.aiAnalyticsService.generateMonthlyReport(start, end).catch((err) => {
        console.error('Background Monthly Report Generation Failed:', err);
      });
    } else {
      throw new BadRequestException('Invalid period type');
    }

    return {
      message:
        'Đang tiến hành tạo báo cáo trong nền. Quá trình này có thể mất vài phút tuỳ thuộc vào lượng dữ liệu.',
      status: 'PROCESSING',
    };
  }

  @Get('reports')
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get a paginated list of generated AI feedback reports',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of reports.',
  })
  async getReports(@Query() query: GetReportsDto) {
    const { periodType, limit } = query;
    const take = parseInt(limit || '10', 10);
    const where = periodType ? { periodType } : {};

    const reports = await this.prisma.aiFeedbackSummaries.findMany({
      where,
      orderBy: { startDate: 'desc' },
      take,
      select: {
        id: true,
        periodType: true,
        startDate: true,
        endDate: true,
        sentimentScore: true,
        totalFeedbacksAnalyzed: true,
        createdAt: true,
      },
    });
    return reports;
  }

  @Get('reports/:id')
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get full details of a specific AI feedback report by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the report',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the full details of the report, including top issues and recommendations.',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found.',
  })
  async getReportDetail(@Param('id') id: string) {
    const report = await this.prisma.aiFeedbackSummaries.findUnique({
      where: { id },
    });
    if (!report) {
      throw new BadRequestException('Report not found');
    }
    return report;
  }
}
