import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FeedbackManagementService } from './feedback_management.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  FeedbackDetailDto,
  ForwardingResponseDto,
  ListFeedbacksResponseDto,
  UpdateFeedbackStatusDto,
  UpdateFeedbackStatusResponseDto,
  CreateForwardingDto,
  QueryFeedbackByStaffDto,
} from './dto';
import { FeedbackParamDto, QueryFeedbacksDto } from 'src/modules/feedbacks/dto';

@Controller('managements')
export class FeedbackManagementController {
  constructor(
    private readonly feedbackManagementService: FeedbackManagementService,
  ) {}
  staff = {
    userId: '550e8400-e29b-41d4-a716-44665544000a',
    departmentId: '550e8400-e29b-41d4-a716-446655440002',
  } as const;
  // @Post()
  // create(@Body() createFeedbackManagementDto: CreateFeedbackManagementDto) {
  //   return this.feedbackManagementService.create(createFeedbackManagementDto);
  // }

  @Get('/staff/feedbacks')
  @ApiOperation({ summary: 'Get all feedbacks of staff' })
  @ApiResponse({
    status: 200,
    description: 'List of user feedbacks',
    type: ListFeedbacksResponseDto,
  })
  getStaffFeedbacks(@Query() query: QueryFeedbackByStaffDto) {
    return this.feedbackManagementService.getAllStaffFeedbacks(
      query,
      this.staff,
    );
  }

  @Get('/staff/feedbacks/:feedbackId')
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
  async getStaffFeedbackDetail(
    @Param() params: FeedbackParamDto,
  ): Promise<FeedbackDetailDto> {
    return this.feedbackManagementService.getStaffFeedbackDetail(
      params,
      this.staff,
    );
  }

  @Patch('/staff/feedbacks/:feedbackId/status')
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
    return this.feedbackManagementService.updateStatus(param, dto, this.staff);
  }

  @Post('/staff/feedbacks/:feedbackId/forwardings')
  @ApiOperation({ summary: 'Forward feedback to another department' })
  @ApiResponse({
    status: 201,
    description: 'Successfully forwarded feedback to another department',
    type: ForwardingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Feedback or department not found' })
  @ApiResponse({ status: 400, description: 'Invalid forwarding request' })
  // @UseGuards(AuthGuard)
  async createForwarding(
    @Param() params: FeedbackParamDto,
    @Body() dto: CreateForwardingDto,
  ): Promise<ForwardingResponseDto> {
    return this.feedbackManagementService.createForwarding(
      params.feedbackId,
      dto,
      { userId: this.staff.userId, departmentId: this.staff.departmentId },
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.feedbackManagementService.remove(+id);
  // }

  //Admin routes
  @Get('/admin/feedbacks')
  @ApiOperation({ summary: 'Get all feedbacks of admin' })
  @ApiResponse({
    status: 200,
    description: 'List of user feedbacks',
    type: ListFeedbacksResponseDto,
  })
  getAllFeedbacks(@Query() query: QueryFeedbacksDto) {
    return this.feedbackManagementService.getAllFeedbacks(query);
  }

  @Get('/admin/feedbacks/:feedbackId')
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
    return this.feedbackManagementService.getFeedbackDetail(params);
  }
}
