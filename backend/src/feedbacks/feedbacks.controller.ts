import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import {
  GetMyFeedbacksResponseDto,
  QueryMyFeedbacksDto,
} from './dto/query-my-feedbacks.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetFeedbackDetailResponse,
  GetFeedbackParamDto,
} from './dto/get-feedback-param.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  // @Post()
  // create(@Body() createFeedbackDto: CreateFeedbackDto) {
  //   return this.feedbacksService.create(createFeedbackDto);
  // }

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

  @Get('/me/:feedbackId')
  @ApiOperation({
    summary: 'Get feedback details by ID',
    description:
      'Retrieve detailed information about a specific feedback, including its status history, forwarding logs, and attached files.',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback detail retrieved successfully',
    type: GetFeedbackDetailResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback not found',
  })
  async getFeedbackDetail(
    @Param() params: GetFeedbackParamDto,
  ): Promise<GetFeedbackDetailResponse> {
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
