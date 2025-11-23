import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetPostsResponseDto,
  PostDetailDto,
  PostParamDto,
  QueryPostsDto,
  VoteResponseDto,
} from './dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@ApiTags('Forum')
@ApiBearerAuth()
@Controller('forum/posts')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of forum posts' })
  @ApiResponse({ status: 200, type: GetPostsResponseDto })
  getListPosts(
    @Query() query: QueryPostsDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<GetPostsResponseDto> {
    return this.forumService.getListPosts(query, actor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a forum post' })
  @ApiResponse({ status: 200, type: PostDetailDto })
  getPostDetail(
    @Param() params: PostParamDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<PostDetailDto> {
    return this.forumService.getPostDetail(params.id, actor);
  }

  @Post(':id/vote')
  @ApiOperation({ summary: 'Vote for a forum post' })
  @ApiResponse({ status: 201, type: VoteResponseDto })
  vote(
    @Param() params: PostParamDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<VoteResponseDto> {
    return this.forumService.vote(params.id, actor);
  }

  @Delete(':id/vote')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove vote from a forum post' })
  @ApiResponse({ status: 200, type: VoteResponseDto })
  unvote(
    @Param() params: PostParamDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<VoteResponseDto> {
    return this.forumService.unvote(params.id, actor);
  }
}
