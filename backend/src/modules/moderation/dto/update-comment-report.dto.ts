import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class UpdateCommentReportDto {
  @ApiProperty({ description: 'New status of the report', enum: ReportStatus })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiProperty({
    description: 'True if the reported comment is deleted',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
  // @ApiPropertyOptional({
  //   description: 'Admin response to the report',
  //   example: 'Comment removed',
  // })
  // @IsOptional()
  // @IsString()
  // @MaxLength(500)
  // adminResponse?: string;
}
