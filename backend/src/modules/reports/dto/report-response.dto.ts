// src/modules/reports/dto/report-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class StatsOverviewDto {
  @ApiProperty({ example: 150 })
  totalFeedbacks: number;
  @ApiProperty({ example: 10 })
  pendingCount: number;
  @ApiProperty({ example: 50 })
  inProgressCount: number;
  @ApiProperty({ example: 80 })
  resolvedCount: number;
  @ApiProperty({ example: 10 })
  rejectedCount: number;
}

export class TopDepartmentStatsDto {
  @ApiProperty({ example: 'IT Department' })
  departmentName: string;
  @ApiProperty({ example: 45 })
  feedbackCount: number;
  @ApiProperty({ example: 24.5, description: 'Average hours to resolve' })
  avgResolutionTimeHours: number;
}

export class FeedbackTrendDto {
  @ApiProperty({ example: '2025-10-01' })
  date: string;
  @ApiProperty({ example: 5 })
  count: number;
}
