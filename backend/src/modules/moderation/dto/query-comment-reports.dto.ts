import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryCommentReportsDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Filter by report status',
    enum: ReportStatus,
  })
  @IsOptional()
  status?: ReportStatus;

  @ApiPropertyOptional({
    description: 'Search by reason or comment content',
    example: 'spam',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Filter by report reason',
    enum: [
      'SPAM',
      'HARASSMENT',
      'INAPPROPRIATE_CONTENT',
      'HATE_SPEECH',
      'OTHER',
    ],
    example: 'SPAM',
  })
  @IsOptional()
  @IsString()
  reportReason?: string;
}
