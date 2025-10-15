import { Controller, Get, Query } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import {
  GetMyFeedbacksResponseDto,
  QueryMyFeedbacksDto,
} from './dto/query-my-feedbacks.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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

  // @Get('/me/:id')
  // getFeedbackDetail(@Param('id') id: string) {
  //   return this.feedbacksService.getFeedbackDetail(+id);
  // }

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
