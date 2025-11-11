import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CommentReportDto,
  CommentReportParamDto,
  CommentReportResponseDto,
  QueryCommentReportsDto,
  UpdateCommentReportDto,
} from './dto';

@Controller('moderation/reports')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  actor = {
    role: 'ADMIN',
    id: '550e8400-e29b-41d4-a716-446655440008',
  } as const;
  @Get('/:commentReportId')
  @ApiOperation({ summary: 'Get comment report details (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Comment report details',
    type: CommentReportDto,
  })
  async GetCommentReportDetail(@Param() params: CommentReportParamDto) {
    return this.moderationService.GetReportDetail(
      params.commentReportId,
      this.actor,
    );
  }
  @Get()
  @ApiOperation({ summary: 'Get all comment reports (admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of comment reports',
    type: CommentReportResponseDto,
  })
  async GetCommentReports(@Query() query: QueryCommentReportsDto) {
    return this.moderationService.GetReports(query, this.actor);
  }
  @Patch('/:commentReportId')
  @ApiOperation({ summary: 'Update comment report status or response (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully',
    type: CommentReportDto,
  })
  async UpdateCommentReport(
    @Param() params: CommentReportParamDto,
    @Body() dto: UpdateCommentReportDto,
  ) {
    return this.moderationService.UpdateReport(
      params.commentReportId,
      dto,
      this.actor,
    );
  }
}
