import { Controller, Get, Body, Param, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Post()
  generateEmbedding(@Body() body: { text: string }) {
    return this.searchService.generateEmbedding(body.text);
  }

  @Public()
  @Get(':id/similarity')
  findSimilarity(
    @Param('id') feedbackId: string,
    // @Body() body: { similarity_threshold?: number },
  ) {
    // const threshold = body.similarity_threshold || 0.7;
    return this.searchService.findSimilarity(feedbackId, 0.7);
  }
}
