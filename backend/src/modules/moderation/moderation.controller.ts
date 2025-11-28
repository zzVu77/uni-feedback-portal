import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ModerationService } from './moderation.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CommentReportDto,
  CommentReportParamDto,
  CommentReportResponseDto,
  QueryCommentReportsDto,
  UpdateCommentReportDto,
} from './dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@ApiTags('Moderation')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('moderation/reports')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('/:commentReportId')
  @ApiOperation({ summary: 'Get comment report details (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Comment report details',
    type: CommentReportDto,
  })
  async getCommentReportDetail(
    @Param() params: CommentReportParamDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.moderationService.getCommentReportDetail(
      params.commentReportId,
      actor,
    );
  }
  @Get()
  @ApiOperation({ summary: 'Get all comment reports (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of comment reports',
    type: CommentReportResponseDto,
  })
  async getCommentReports(
    @Query() query: QueryCommentReportsDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.moderationService.getCommentReports(query, actor);
  }
  @Patch('/:commentReportId')
  @ApiOperation({
    summary: 'Update comment report status or response (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully',
    type: CommentReportDto,
  })
  async updateCommentReport(
    @Param() params: CommentReportParamDto,
    @Body() dto: UpdateCommentReportDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.moderationService.updateCommentReport(
      params.commentReportId,
      dto,
      actor,
    );
  }
}
