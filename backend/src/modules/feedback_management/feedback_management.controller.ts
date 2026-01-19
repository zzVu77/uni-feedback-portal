import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FeedbackDetailDto,
  ForwardingResponseDto,
  ListFeedbacksResponseDto,
  UpdateFeedbackStatusDto,
  UpdateFeedbackStatusResponseDto,
  CreateForwardingDto,
  // QueryFeedbackByStaffDto,
} from './dto';
import { FeedbackParamDto, QueryFeedbacksDto } from 'src/modules/feedbacks/dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@ApiTags('Feedback Management')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('managements')
export class FeedbackManagementController {
  constructor(
    private readonly feedbackManagementService: FeedbackManagementService,
  ) {}
  staff = {
    userId: '550e8400-e29b-41d4-a716-44665544000a',
    departmentId: '550e8400-e29b-41d4-a716-446655440002',
  } as const;
  // ==========================================================
  // 1. DEPARTMENT STAFF ROUTES
  // ==========================================================
  @Get('/staff/feedbacks')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Get feedbacks for the current staff member' })
  @ApiResponse({
    status: 200,
    description: "List of feedbacks in the staff member's department",
    type: ListFeedbacksResponseDto,
  })
  getStaffFeedbacks(
    @Query() query: QueryFeedbacksDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    query.departmentId = actor.departmentId;
    return this.feedbackManagementService.getAllFeedbacks(query);
  }

  @Get('/staff/feedbacks/:feedbackId')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({
    summary: 'Get feedback details by ID (Staff only)',
    description:
      "Retrieve detailed information about a specific feedback within the staff member's department.",
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback detail retrieved successfully',
    type: FeedbackDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found in this department',
  })
  async getStaffFeedbackDetail(
    @Param() params: FeedbackParamDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<FeedbackDetailDto> {
    return this.feedbackManagementService.getStaffFeedbackDetail(params, actor);
  }

  @Patch('/staff/feedbacks/:feedbackId/status')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({ summary: 'Update the status of a feedback (Staff only)' })
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
    return this.feedbackManagementService.updateStatus(param, dto, actor);
  }

  @Post('/staff/feedbacks/:feedbackId/forwardings')
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({
    summary: 'Forward feedback to another department (Staff only)',
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
      actor,
    );
  }

  // ==========================================================
  // 2. ADMIN ROUTES
  // ==========================================================

  @Get('/admin/feedbacks')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all feedbacks (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all feedbacks in the system',
    type: ListFeedbacksResponseDto,
  })
  getAllFeedbacks(@Query() query: QueryFeedbacksDto) {
    return this.feedbackManagementService.getAllFeedbacks(query);
  }

  @Get('/admin/feedbacks/:feedbackId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get any feedback details by ID (Admin only)',
    description:
      'Retrieve detailed information about any specific feedback in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback detail retrieved successfully',
    type: FeedbackDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found',
  })
  async getFeedbackDetail(
    @Param() params: FeedbackParamDto,
  ): Promise<FeedbackDetailDto> {
    return this.feedbackManagementService.getFeedbackDetail(params);
  }
}
