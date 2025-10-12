import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { QueryPostsDto } from './dto/query-posts.dto';
import { GetPostsResponseDto } from './dto/get-posts-respone.dto';
import { GetPostParamDto } from './dto/get-post-param.dto';
import { GetPostResponseDto } from './dto/get-post-detail-respone.dto';
// import { QueryCommentsResponseDto } from './dto/query-comments-respone.dto';
// import { QueryCategoriesDto } from 'src/categories/dto/query-categories.dto';
@ApiTags('Forum Post')
@Controller('post')
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
    return await this.forumService.getListPosts(query);
  }
  // Get post detail
  @Get(':id')
  @ApiOkResponse({
    description: 'Get post detail',
    type: GetPostResponseDto,
  })
  getPostDetail(@Param() param: GetPostParamDto): Promise<GetPostResponseDto> {
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
