import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CommentDto,
  CommentsResponseDto,
  CreateCommentReportDto,
  QueryCommentsDto,
  CommentParamDto,
  CommentDeletedResponseDto,
} from './dto';
import { PostParamDto } from '../forum/dto';
import { AnnouncementParamDto } from '../announcements/dto';
import { UserRole } from '@prisma/client';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  userId = '550e8400-e29b-41d4-a716-446655440009'; // dummy userId
  // ==========================================================
  // 1. FORUM POST COMMENTS
  // ==========================================================

  @Post('/post/:id')
  @ApiOperation({ summary: 'Create a comment for a Forum Post' })
  @ApiOkResponse({
    description: 'Comment created successfully',
    type: CommentDto,
  })
  async CreateForumPostComment(
    @Param() params: PostParamDto,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.CreateForumPostComment(
      createCommentDto,
      params.id,
      this.userId,
    );
  }
  @Get('/post/:id')
  @ApiOperation({ summary: 'Get comments for a Forum Post' })
  @ApiOkResponse({
    description: 'List of comments',
    type: CommentsResponseDto,
  })
  async GetForumPostComments(
    @Param() params: PostParamDto,
    @Query() query: QueryCommentsDto,
  ) {
    return this.commentService.GetForumPostComments(params.id, query);
  }
  // ==========================================================
  // 2.ANNOUNCEMENT COMMENTS
  // ==========================================================

  @Post('/announcement/:id')
  @ApiOperation({ summary: 'Create a comment for an Announcement' })
  @ApiOkResponse({
    description: 'Comment created successfully',
    type: CommentDto,
  })
  async CreateAnnouncementComment(
    @Param() params: AnnouncementParamDto,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.CreateAnnouncementComment(
      createCommentDto,
      params.id,
      this.userId,
    );
  }

  @Get('/announcement/:id')
  @ApiOperation({ summary: 'Get comments for an Announcement' })
  @ApiOkResponse({
    description: 'List of comments',
    type: CommentsResponseDto,
  })
  async GetAnnouncementComments(
    @Param() params: AnnouncementParamDto,
    @Query() query: QueryCommentsDto,
  ) {
    return this.commentService.GetAnnouncementComments(params.id, query);
  }
  // ==========================================================
  // 3. SHARED ACTIONS (Report, Delete)
  // ==========================================================

  @Post('/report/:commentId')
  @ApiOperation({ summary: 'Report a comment (user)' })
  @ApiResponse({
    status: 204,
    description: 'Report created successfully',
  })
  @HttpCode(204)
  async CreateCommentReport(
    @Param() params: CommentParamDto,
    @Body() dto: CreateCommentReportDto,
  ) {
    await this.commentService.CreateCommentReport(
      params.commentId,
      this.userId,
      dto,
    );
  }
  @Delete('/:commentId')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({
    status: 200,
    description: 'Delete comment successfully',
    type: CommentDeletedResponseDto,
  })
  async DeleteComment(@Param() params: CommentParamDto) {
    return this.commentService.DeleteComment(params.commentId, {
      id: this.userId,
      role: UserRole.STUDENT,
    });
  }
}
