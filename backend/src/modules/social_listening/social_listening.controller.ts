// src/modules/social_listening/social_listening.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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

@ApiTags('Social Listening')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('social-listening')
export class SocialListeningController {
  constructor(
    private readonly socialListeningService: SocialListeningService,
  ) {}

  @Get('trending-issues')
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
}
