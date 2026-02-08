import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import {
  FeedbackSummary,
  GetMyFeedbacksResponseDto,
  QueryFeedbacksDto,
  FeedbackDetail,
  FeedbackParamDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.STUDENT)
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new feedback (Student only)',
    description:
      'Allows users to submit feedback to a specific department. Attachments such as images or documents can also be included.',
  })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({
    status: 201,
    description: 'Feedback created successfully',
    type: FeedbackSummary,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or missing required fields',
  })
  createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.feedbacksService.createFeedback(createFeedbackDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get feedbacks for the logged-in student' })
  @ApiResponse({
    status: 200,
    description: 'List of feedbacks',
    type: GetMyFeedbacksResponseDto,
  })
  getFeedbacks(
    @Query() query: QueryFeedbacksDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.feedbacksService.getFeedbacks(query, actor);
  }

  @Get('/me/:feedbackId')
  @ApiOperation({
    summary: 'Get feedback details by ID (Student and Owner only)',
    description:
      'Retrieve detailed information about a specific feedback, including its status history, forwarding logs, and attached files.',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback detail retrieved successfully',
    type: FeedbackDetail,
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found',
  })
  async getFeedbackDetail(
    @Param() params: FeedbackParamDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<FeedbackDetail> {
    return this.feedbacksService.getFeedbackDetail(params, actor);
  }

  @Patch('/me/:feedbackId')
  @ApiOperation({
    summary: 'Update a feedback (Student and Owner only)',
    description:
      'Allows the user to update their own feedback, but only if it is in "PENDING" status. All fields are optional.',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback updated successfully',
    type: FeedbackDetail,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  updateFeedback(
    @Param() params: FeedbackParamDto,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<FeedbackDetail> {
    return this.feedbacksService.updateFeedback(
      params,
      updateFeedbackDto,
      user,
    );
  }

  @Delete('/me/:feedbackId')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a feedback (Student and Owner only)',
    description:
      'Allows the user to delete their own feedback, but only if it is in "PENDING" status.',
  })
  @ApiResponse({
    status: 204,
    description: 'Feedback deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  deleteFeedback(
    @Param() params: FeedbackParamDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<void> {
    return this.feedbacksService.deleteFeedback(params, user);
  }

  @Get('/feedback-toxic/:jobId')
  @ApiOperation({
    summary: 'Get toxic feedback analysis job status',
    description: 'Returns the current processing status of a toxic feedback analysis job for the given jobId.',
  })
  @ApiResponse({
    status: 200,
    description: 'Job status retrieved successfully',
    schema: {
      example: {
        status: 'APPROVED',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  getToxicJobStatus(@Param('jobId') jobId: string) {
    return this.feedbacksService.getToxicJobStatus(jobId);
  }
}
