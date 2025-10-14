import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import {
  GetPostsResponseDto,
  QueryPostsDto,
  GetPostResponseDto,
  GetPostParamDto,
} from './dto';

// import { QueryCommentsResponseDto } from './dto/query-comments-respone.dto';
// import { QueryCategoriesDto } from 'src/categories/dto/query-categories.dto';
@ApiTags('Forum Post')
@Controller('forum/posts')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}
  // Get all posts
  @Get()
  @ApiOkResponse({
    description: 'Get list posts',
    type: [GetPostsResponseDto], // Swagger hiển thị array PostResponseDto
  })
  @ApiOperation({ summary: 'Get all posts' })
  async getListPosts(
    @Query() query: QueryPostsDto,
  ): Promise<GetPostsResponseDto> {
    return await this.forumService.getListPosts(query, 2);
  }
  // Get post detail
  @Get(':id')
  @ApiOkResponse({
    description: 'Get post detail',
    type: GetPostResponseDto,
  })
  async getPostDetail(
    @Param() param: GetPostParamDto,
  ): Promise<GetPostResponseDto> {
    return this.forumService.getPostDetail(param.id, 1);
  }

  // @Get(':id/comments')
  // @ApiOkResponse({
  //   description: 'Get comments of a post',
  //   type: [QueryCommentsResponseDto],
  // })
  // @ApiOperation({ summary: 'Get list of comments by post_id' })
  // async listComments(
  //   @Param() param: GetPostParamDto,
  //   @Query() query: QueryCategoriesDto,
  // ) {
  //   return this.forumService.listComments(param.id, query);
  // }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateForumDto: UpdateForumDto) {
  //   return this.forumService.update(+id, updateForumDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.forumService.remove(+id);
  // }
}
