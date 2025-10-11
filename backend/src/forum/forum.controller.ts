import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { QueryPostsDto } from './dto/query-posts.dto';
import { QueryPostsResponseDto } from './dto/query-posts-response.dto';
import { GetPostParamDto } from './dto/get-post-param.dto';
import { GetPostResponseDto } from './dto/get-post-param-response.dto';
import { QueryCommentsResponseDto } from './dto/query-comments-response.dto';
import { QueryCategoriesDto } from 'src/categories/dto/query-categories.dto';
@ApiTags('Forum Post')
@Controller('posts')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}
  // Get all posts
  @Get()
  @ApiOkResponse({
    description: 'List posts',
    type: QueryPostsResponseDto,
  })
  @ApiOperation({ summary: 'Get all posts' })
  async listPosts(@Query() query: QueryPostsDto) {
    return this.forumService.listPosts(query);
  }
  // Get post detail
  @Get(':id')
  @ApiOkResponse({
    description: 'Get post detail',
    type: GetPostResponseDto,
  })
  async getPost(@Param() param: GetPostParamDto) {
    return this.forumService.getPost(param.id, 1);
  }

  @Get(':id/comments')
  @ApiOkResponse({
    description: 'Get comments of a post',
    type: [QueryCommentsResponseDto],
  })
  // Get list of comments by post_id
  @ApiOperation({ summary: 'Get list of comments by post_id' })
  async listComments(
    @Param() param: GetPostParamDto,
    @Query() query: QueryCategoriesDto,
  ) {
    return this.forumService.listComments(param.id, query);
  }
}
