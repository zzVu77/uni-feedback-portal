import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import {
  GetPostsResponseDto,
  QueryPostsDto,
  PostDetailDto,
  PostParamDto,
  VoteResponseDto,
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
    type: PostDetailDto,
  })
  async getPostDetail(@Param() param: PostParamDto): Promise<PostDetailDto> {
    return this.forumService.getPostDetail(param.id, this.userId);
  }
  // 👍 Vote a post
  @Post(':id/vote')
  @ApiOkResponse({
    description: 'Vote a post successfully',
    type: VoteResponseDto,
  })
  @ApiOperation({ summary: 'Vote a post' })
  async votePost(@Param() param: PostParamDto): Promise<VoteResponseDto> {
    return this.forumService.vote(param.id, this.userId);
  }

  // 👎 Unvote a post
  @Delete(':id/vote')
  @ApiOkResponse({
    description: 'Unvote a post successfully',
    type: VoteResponseDto,
  })
  @ApiOperation({ summary: 'Unvote a post' })
  async unvotePost(@Param() param: PostParamDto): Promise<VoteResponseDto> {
    return this.forumService.unvote(param.id, this.userId);
  }
}
