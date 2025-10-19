import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';
import { QueryManageFeedbacksDto } from './dto/query-manage-feedbacks.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  FeedbackDetailDto,
  ListFeedbacksResponseDto,
} from './dto/feedback_management_response.dto';
import { FeedbackParamDto } from 'src/feedbacks/dto';
import {
  UpdateFeedbackStatusDto,
  UpdateFeedbackStatusResponseDto,
} from './dto/update-feedback-status.dto';

@Controller('managements/staff/feedbacks')
export class FeedbackManagementController {
  constructor(
    private readonly feedbackManagementService: FeedbackManagementService,
  ) {}
  actor = {
    userId: 1,
    role: 'DEPARTMENT_STAFF',
    departmentId: 1,
  } as const;

  // @Post()
  // create(@Body() createFeedbackManagementDto: CreateFeedbackManagementDto) {
  //   return this.feedbackManagementService.create(createFeedbackManagementDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks of admin' })
  @ApiResponse({
    status: 200,
    description: 'List of user feedbacks',
    type: ListFeedbacksResponseDto,
  })
  getAllFeedbacks(@Query() query: QueryManageFeedbacksDto) {
    return this.feedbackManagementService.getAllFeedbacks(query, this.actor);
  }

  @Get(':feedbackId')
  @ApiOperation({
    summary: 'Get feedback details by ID',
    description:
      'Retrieve detailed information about a specific feedback, including its status history, forwarding logs, and attached files.',
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
    return this.feedbackManagementService.getFeedbackDetail(params, this.actor);
  }

  @Patch(':feedbackId/status')
  @ApiOperation({ summary: 'Update the status of a feedback' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated feedback status',
    type: UpdateFeedbackStatusResponseDto,
  })
  async updateStatus(
    @Param() param: FeedbackParamDto,
    @Body() dto: UpdateFeedbackStatusDto,
  ): Promise<UpdateFeedbackStatusResponseDto> {
    return this.feedbackManagementService.updateStatus(param, dto, this.actor);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.feedbackManagementService.remove(+id);
  // }
}
