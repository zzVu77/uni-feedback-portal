import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';
import { QueryManageFeedbacksDto } from './dto/query-manage-feedbacks.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  FeedbackDetailDto,
  ListFeedbacksResponseDto,
} from './dto/feedback_management_response.dto';
import { GetFeedbackParamDto } from 'src/feedbacks/dto';

@Controller('feedback-management')
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
    @Param() params: GetFeedbackParamDto,
  ): Promise<FeedbackDetailDto> {
    return this.feedbackManagementService.getFeedbackDetail(params, this.actor);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFeedbackManagementDto: UpdateFeedbackManagementDto,
  // ) {
  //   return this.feedbackManagementService.update(
  //     +id,
  //     updateFeedbackManagementDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.feedbackManagementService.remove(+id);
  // }
}
