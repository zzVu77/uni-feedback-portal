import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import {
  FeedbackSummary,
  GetMyFeedbacksResponseDto,
  QueryFeedbacksDto,
  FeedbackDetail,
  FeedbackParamDto,
} from './dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}
  userId = '550e8400-e29b-41d4-a716-446655440009'; // dummy userId
  @Post()
  @ApiOperation({
    summary: 'Create a new feedback',
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
  createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.createFeedback(createFeedbackDto, this.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks of the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user feedbacks',
    type: GetMyFeedbacksResponseDto,
  })
  getMyFeedbacks(@Query() query: QueryFeedbacksDto) {
    return this.feedbacksService.getMyFeedbacks(query, this.userId);
  }

  @Get('/me/:feedbackId')
  @ApiOperation({
    summary: 'Get feedback details by ID',
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
  ): Promise<FeedbackDetail> {
    return this.feedbacksService.getFeedbackDetail(params, this.userId);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFeedbackDto: UpdateFeedbackDto,
  // ) {
  //   return this.feedbacksService.update(+id, updateFeedbackDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.feedbacksService.remove(+id);
  // }
}
