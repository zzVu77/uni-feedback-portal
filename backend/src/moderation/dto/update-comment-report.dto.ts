import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatuses } from '@prisma/client';

export class UpdateCommentReportDto {
  @IsEnum(ReportStatuses)
  status: ReportStatuses;

  @IsOptional()
  @IsString()
  adminResponse?: string;
}
