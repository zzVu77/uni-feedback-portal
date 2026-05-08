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

  /** Read-only: embed from DB text + vector + rerank (does not persist links). */
  @Public()
  @Get(':id/similarity')
  async findSimilarity(@Param('id') feedbackId: string) {
    return this.searchService.findSimilarity(feedbackId);
  }
}
