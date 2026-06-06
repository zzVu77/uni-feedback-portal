import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { GithubActionService } from './github-action.service';
import { TriggerGithubActionDto } from './dto/trigger-action.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Github Actions')
@ApiBearerAuth()
@Controller('github-action')
@UseGuards(RolesGuard)
export class GithubActionController {
  constructor(private readonly githubActionService: GithubActionService) {}

  @Post('trigger')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Trigger a GitHub Action workflow (Admin only)' })
  @ApiResponse({ status: 200, description: 'Workflow triggered successfully.' })
  @ApiResponse({
    status: 500,
    description: 'GitHub PAT is not configured or GitHub API failed.',
  })
  triggerWorkflow(@Body() dto: TriggerGithubActionDto) {
    return this.githubActionService.triggerWorkflow(dto);
  }
}
