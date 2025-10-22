import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import {
  GetPostsResponseDto,
  QueryPostsDto,
  PostResponseDto,
  GetPostParamDto,
} from './dto';
@ApiTags('Forum Post')
@Controller('forum/posts')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}
  userId = '550e8400-e29b-41d4-a716-446655440009'; // dummy userId
  // Get all posts
  @Get()
  @ApiOkResponse({
    description: 'Get list posts',
    type: [GetPostsResponseDto],
  })
  @ApiOperation({ summary: 'Get all posts' })
  async getListPosts(
    @Query() query: QueryPostsDto,
  ): Promise<GetPostsResponseDto> {
    return await this.forumService.getListPosts(query, this.userId);
  }
  // Get post detail
  @Get(':id')
  @ApiOkResponse({
    description: 'Get post detail',
    type: PostResponseDto,
  })
  async getPostDetail(
    @Param() param: GetPostParamDto,
  ): Promise<PostResponseDto> {
    return this.forumService.getPostDetail(param.id, this.userId);
  }
}
