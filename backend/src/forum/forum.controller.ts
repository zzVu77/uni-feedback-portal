import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { QueryPostsDto } from './dto/query-posts.dto';
import { QueryPostsResponseDto } from './dto/query-posts-respone.dto';
import { GetPostParamDto } from './dto/get-post-param.dto';
import { GetPostResponseDto } from './dto/get-post-param-respone.dto';
import { QueryCommentsResponseDto } from './dto/query-comments-respone.dto';
import { QueryCategoriesDto } from 'src/categories/dto/query-categories.dto';
@ApiTags('Forum Post') // sẽ hiển thị “Diễn đàn” thay vì “Forum”
@Controller('posts')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  // @Post()
  // create(@Body() createForumDto: CreateForumDto) {
  //   return this.forumService.create(createForumDto);
  // }
  @Get()
  @ApiOkResponse({
    description: 'List posts',
    type: [QueryPostsResponseDto], // Swagger hiển thị array PostResponseDto
  })
  @ApiOperation({ summary: 'Get all posts' })
  async listPosts(@Query() query: QueryPostsDto) {
    return this.forumService.listPosts(query);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get post detail',
    type: GetPostResponseDto, // Swagger hiển thị array PostResponseDto
  })
  findOne(@Param() param: GetPostParamDto) {
    return this.forumService.getPost(param.id, 1);
  }

  @Get(':id/comments')
  @ApiOkResponse({
    description: 'Get comments of a post',
    type: [QueryCommentsResponseDto],
  })
  @ApiOperation({ summary: 'Get list of comments by post_id' })
  async listComments(
    @Param() param: GetPostParamDto,
    @Query() query: QueryCategoriesDto,
  ) {
    return this.forumService.listComments(param.id, query);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateForumDto: UpdateForumDto) {
  //   return this.forumService.update(+id, updateForumDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.forumService.remove(+id);
  // }
}
