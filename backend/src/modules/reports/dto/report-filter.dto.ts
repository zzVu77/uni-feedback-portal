import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class ReportFilterDto {
  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Start date for statistics (ISO8601)',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'End date for statistics (ISO8601)',
  })
  @IsOptional()
  @IsISO8601()
  to?: string;
}
