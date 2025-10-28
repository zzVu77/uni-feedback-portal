import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { QueryCommentsDto } from './dto';
import { PostParamDto } from '../forum/dto';

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
  // 🟡 Get all comments
  @Get('/post/:id')
  @ApiOperation({ summary: 'Get all comments' })
  @ApiOkResponse({ description: 'List of comments' })
  async getComments(
    @Param() params: PostParamDto,
    @Query() query: QueryCommentsDto,
  ) {
    return this.commentService.getComments(params.id, query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentService.update(+id, updateCommentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.commentService.remove(+id);
  // }
}
