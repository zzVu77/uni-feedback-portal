import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CommentReportDto,
  CommentReportResponseDto,
  CreateCommentReportDto,
  QueryCommentReportsDto,
  QueryCommentsDto,
  UpdateCommentReportDto,
} from './dto';
import { PostParamDto } from '../forum/dto';
import {
  CommentParamDto,
  CommentReportParamDto,
} from './dto/comment-param.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  userId = '550e8400-e29b-41d4-a716-446655440009'; // dummy userId
  @Post('/post/:id')
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiOkResponse({ description: 'Comment created successfully' })
  async createComment(
    @Param() params: PostParamDto,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      createCommentDto,
      params.id,
      this.userId,
    );
  }
  @Get('/post/:id')
  @ApiOperation({ summary: 'Get all comments' })
  @ApiOkResponse({ description: 'List of comments' })
  async getComments(
    @Param() params: PostParamDto,
    @Query() query: QueryCommentsDto,
  ) {
    return this.commentService.getComments(params.id, query);
  }

  @Post('reports/:commentId')
  @ApiOperation({ summary: 'Report a comment (user)' })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
    type: CommentReportDto,
  })
  async createReport(
    @Param() params: CommentParamDto,
    @Body() dto: CreateCommentReportDto,
  ) {
    return this.commentService.createReport(params.commentId, this.userId, dto);
  }
  @Get('/reports/:commentReportId')
  @ApiOperation({ summary: 'Get comment report details (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Comment report details',
    type: CommentReportDto,
  })
  async getReportDetail(@Param() params: CommentReportParamDto) {
    return this.commentService.getReportDetail(params.commentReportId);
  }
  @Get('/reports')
  @ApiOperation({ summary: 'Get all comment reports (admin)' })
  @ApiResponse({
    status: 200,
    description: 'List of comment reports',
    type: CommentReportResponseDto,
  })
  async getReports(@Query() query: QueryCommentReportsDto) {
    return this.commentService.getReports(query);
  }
  @Patch('/reports/:commentReportId')
  @ApiOperation({ summary: 'Update comment report status or response (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully',
    type: CommentReportDto,
  })
  async updateReport(
    @Param() params: CommentReportParamDto,
    @Body() dto: UpdateCommentReportDto,
  ) {
    return this.commentService.updateReport(params.commentReportId, dto);
  }
}
