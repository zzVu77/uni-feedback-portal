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

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  userId = '550e8400-e29b-41d4-a716-446655440009'; // dummy userId
  @Post('/post/:id')
  @ApiOperation({ summary: 'Create a new comment' })
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
  @ApiOperation({ summary: 'Get all comments' })
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
  @Post('/report/:commentId')
  @ApiOperation({ summary: 'Report a comment (user)' })
  @ApiResponse({
    status: 204,
    description: 'Report created successfully',
  })
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
    status: 201,
    description: 'Delete comment successfully',
    type: CommentDeletedResponseDto,
  })
  async DeleteComment(@Param() params: CommentParamDto) {
    return this.commentService.DeleteComment(params.commentId, {
      id: this.userId,
      role: 'STUDENT',
    });
  }
}
