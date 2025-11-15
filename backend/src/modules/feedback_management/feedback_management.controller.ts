import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ForwardingResponseDto,
  UpdateFeedbackStatusDto,
  UpdateFeedbackStatusResponseDto,
  CreateForwardingDto,
} from './dto';
import { FeedbackParamDto } from 'src/modules/feedbacks/dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@ApiTags('Feedback Management')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.DEPARTMENT_STAFF)
@Controller('feedback-management')
export class FeedbackManagementController {
  constructor(
    private readonly feedbackManagementService: FeedbackManagementService,
  ) {}

  @Patch(':feedbackId/status')
  @ApiOperation({
    summary: 'Update the status of a feedback (Department Staff only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated feedback status',
    type: UpdateFeedbackStatusResponseDto,
  })
  async updateStatus(
    @Param() param: FeedbackParamDto,
    @Body() dto: UpdateFeedbackStatusDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<UpdateFeedbackStatusResponseDto> {
    return this.feedbackManagementService.updateStatus(param, dto, {
      userId: actor.sub,
      departmentId: actor.departmentId ?? '',
    });
  }

  @Post(':feedbackId/forward')
  @ApiOperation({
    summary: 'Forward feedback to another department (Department Staff only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully forwarded feedback to another department',
    type: ForwardingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Feedback or department not found' })
  @ApiResponse({ status: 400, description: 'Invalid forwarding request' })
  async createForwarding(
    @Param() params: FeedbackParamDto,
    @Body() dto: CreateForwardingDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<ForwardingResponseDto> {
    return this.feedbackManagementService.createForwarding(
      params.feedbackId,
      dto,
      { userId: actor.sub, departmentId: actor.departmentId ?? '' },
    );
  }
}
