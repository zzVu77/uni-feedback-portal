import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import {
  FeedbackSummary,
  GetMyFeedbacksResponseDto,
  QueryMyFeedbacksDto,
  FeedbackDetail,
  FeedbackParamDto,
} from './dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { SearchMyFeedbacksDto } from './dto/search-my-feedbacks.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

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
    return this.feedbacksService.createFeedback(createFeedbackDto, 1);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks of the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user feedbacks',
    type: GetMyFeedbacksResponseDto,
  })
  getMyFeedbacks(@Query() query: QueryMyFeedbacksDto) {
    return this.feedbacksService.getMyFeedbacks(query, 2);
  }

  @Get('/me/search')
  @ApiOperation({ summary: 'Search feedbacks of the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user feedbacks after search filters applied',
    type: GetMyFeedbacksResponseDto,
  })
  searchMyFeedbacks(@Query() query: SearchMyFeedbacksDto) {
    return this.feedbacksService.searchMyFeedbacks(query, 2);
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
    return this.feedbacksService.getFeedbackDetail(params, 2);
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
