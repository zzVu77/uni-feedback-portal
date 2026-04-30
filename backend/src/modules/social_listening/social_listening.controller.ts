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
}
