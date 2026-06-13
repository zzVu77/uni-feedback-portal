import { ApiProperty } from '@nestjs/swagger';
import { ReportPeriodType } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';

export class TriggerReportDto {
  @ApiProperty({
    enum: ReportPeriodType,
    description: 'The type of report to generate (WEEKLY or MONTHLY)',
    example: 'WEEKLY',
  })
  @IsEnum(ReportPeriodType)
  periodType: ReportPeriodType;

  @ApiProperty({
    description: 'The start date of the period in ISO 8601 format',
    example: '2026-10-01T00:00:00Z',
  })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    description: 'The end date of the period in ISO 8601 format',
    example: '2026-10-07T23:59:59Z',
  })
  @IsISO8601()
  endDate: string;
}

export class GetReportsDto {
  @ApiProperty({
    enum: ReportPeriodType,
    description: 'Filter by period type',
    required: false,
  })
  @IsOptional()
  @IsEnum(ReportPeriodType)
  periodType?: ReportPeriodType;

  @ApiProperty({
    description: 'Limit the number of returned reports',
    required: false,
    default: '10',
    example: '10',
  })
  @IsOptional()
  @IsString()
  limit?: string;
}
