// src/modules/social_listening/social_listening.controller.ts
import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SocialListeningService } from './social_listening.service';
import { GetTrendingIssuesDto } from './dto/get-trending-issues.dto';
import { GetPostCommentsDto } from './dto/get-post-comments.dto';
import { PostCommentsResponseDto } from './dto/post-comments-response.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Social Listening')
@ApiBearerAuth()
@Controller('social-listening')
export class SocialListeningController {
  constructor(
    private readonly socialListeningService: SocialListeningService,
  ) {}

  @Get('trending-issues')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get trending issues data for dashboard with dynamic filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of trending issues',
  })
  async getTrendingIssues(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getTrendingIssues(query);
  }

  @Get('kpi-overview')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get KPI overview statistics for social listening',
  })
  @ApiResponse({
    status: 200,
    description: 'KPI overview statistics',
  })
  async getKPIOverview(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getKPIOverview(query);
  }

  @Get('sentiment-trend')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get sentiment trend statistics grouped by date',
  })
  @ApiResponse({
    status: 200,
    description: 'Sentiment trend statistics',
  })
  async getSentimentTrend(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getSentimentTrend(query);
  }

  @Get('topic-distribution')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get topic distribution statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Topic distribution statistics',
  })
  async getTopicDistribution(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getTopicDistribution(query);
  }

  @Get('classification-sentiment')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get post count grouped by sentiment label',
  })
  @ApiResponse({
    status: 200,
    description: 'Sentiment classification statistics',
  })
  async getClassificationSentiment(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getClassificationSentiment(query);
  }

  @Get('post-count-by-date')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get total post count grouped by date',
  })
  @ApiResponse({
    status: 200,
    description: 'Post count per day',
  })
  async getPostCountByDate(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getPostCountByDate(query);
  }

  @Get('posts-by-sentiment')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get all positive and negative posts',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all positive and negative posts',
  })
  async getPostsBySentiment(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getPostsBySentiment(query);
  }

  @Get('topic-by-sentiment')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Get sentiment distribution for each topic',
  })
  @ApiResponse({
    status: 200,
    description: 'Sentiment distribution by topic',
  })
  async getTopicSentimentDistribution(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getTopicSentimentDistribution(query);
  }

  @Get('urgent-issues')
  @Public()
  @ApiOperation({
    summary:
      'Get urgent issues based on severity keywords and negative sentiment',
  })
  @ApiResponse({
    status: 200,
    description: 'List of urgent feedback posts',
  })
  async getUrgentIssues(@Query() query: GetTrendingIssuesDto) {
    return this.socialListeningService.getUrgentIssues(query);
  }

  @Get('posts/:postId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết một bài viết mạng xã hội theo ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết bài viết mạng xã hội',
  })
  @ApiResponse({
    status: 404,
    description: 'Bài viết không tồn tại',
  })
  async getPostById(@Param('postId') postId: string) {
    return this.socialListeningService.getPostById(postId);
  }

  @Get('posts/:postId/comments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF, UserRole.STAFF_ASSISTANT)
  @ApiOperation({
    summary:
      'Lấy danh sách bình luận chi tiết và thống kê cảm xúc của bài viết',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bình luận, phân loại cảm xúc và phân trang',
    type: PostCommentsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Bài viết không tồn tại',
  })
  async getPostComments(
    @Param('postId') postId: string,
    @Query() query: GetPostCommentsDto,
  ) {
    return this.socialListeningService.getPostComments(postId, query);
  }

  @Post('posts/:postId/crawl-comments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Kích hoạt cào bình luận theo yêu cầu cho bài viết (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Yêu cầu cào bình luận đã được gửi tới hệ thống pipeline',
  })
  @ApiResponse({
    status: 404,
    description: 'Bài viết không tồn tại',
  })
  async triggerCrawlPostComments(
    @Param('postId') postId: string,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.socialListeningService.triggerCrawlPostComments(postId, actor);
  }
}
