import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class UpdateCommentReportDto {
  @ApiProperty({ description: 'New status of the report', enum: ReportStatus })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiPropertyOptional({
    description: 'Admin response to the report',
    example: 'Comment removed',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  adminResponse?: string;
}
