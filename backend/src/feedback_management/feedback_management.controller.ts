import { Controller, Get, Query } from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';
import { QueryManageFeedbacksDto } from './dto/query-manage-feedbacks.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListFeedbacksResponseDto } from './dto/feedback_management_response.dto';

@Controller('feedback-management')
export class FeedbackManagementController {
  constructor(
    private readonly feedbackManagementService: FeedbackManagementService,
  ) {}

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
  findAll(@Query() query: QueryManageFeedbacksDto) {
    const actor = {
      userId: 1,
      role: 'DEPARTMENT_STAFF',
      departmentId: 1,
    } as const;
    return this.feedbackManagementService.getAllFeedbacks(query, actor);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.feedbackManagementService.findOne(+id);
  // }

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
