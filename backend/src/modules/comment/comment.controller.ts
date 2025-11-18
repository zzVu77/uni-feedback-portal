import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { CommentReports } from '@prisma/client';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // ==========================================================
  // 1. FORUM POST COMMENTS
  // ==========================================================

  @Post('/post/:id')
  @ApiOperation({ summary: 'Create a comment for a Forum Post' })
  @ApiOkResponse({
    description: 'Comment created successfully',
    type: CommentDto,
  })
  async createForumPostComment(
    @Param() params: PostParamDto,
    @Body() createCommentDto: CreateCommentDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.commentService.createForumPostComment(
      createCommentDto,
      params.id,
      actor,
    );
  }
  @Get('/post/:id')
  @ApiOperation({ summary: 'Get comments for a Forum Post' })
  @ApiOkResponse({
    description: 'List of comments',
    type: CommentsResponseDto,
  })
  async getForumPostComments(
    @Param() params: PostParamDto,
    @Query() query: QueryCommentsDto,
  ) {
    return this.commentService.getForumPostComments(params.id, query);
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
  async createAnnouncementComment(
    @Param() params: AnnouncementParamDto,
    @Body() createCommentDto: CreateCommentDto,
    @ActiveUser() actor: ActiveUserData,
  ) {
    return this.commentService.createAnnouncementComment(
      createCommentDto,
      params.id,
      actor,
    );
  }

  @Get('/announcement/:id')
  @ApiOperation({ summary: 'Get comments for an Announcement' })
  @ApiOkResponse({
    description: 'List of comments',
    type: CommentsResponseDto,
  })
  async getAnnouncementComments(
    @Param() params: AnnouncementParamDto,
    @Query() query: QueryCommentsDto,
  ) {
    return this.commentService.getAnnouncementComments(params.id, query);
  }
  // ==========================================================
  // 3. SHARED ACTIONS (Report, Delete)
  // ==========================================================

  @Post('/report/:commentId')
  @ApiOperation({ summary: 'Report a comment (user)' })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
  })
  async createCommentReport(
    @Param() params: CommentParamDto,
    @Body() dto: CreateCommentReportDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<CommentReports> {
    return this.commentService.createCommentReport(
      params.commentId,
      actor,
      dto,
    );
  }
  @Delete('/:commentId')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({
    status: 204,
    description: 'Delete comment successfully',
  })
  async deleteComment(
    @Param() params: CommentParamDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<CommentDeletedResponseDto> {
    return this.commentService.deleteComment(params.commentId, actor);
  }
}
