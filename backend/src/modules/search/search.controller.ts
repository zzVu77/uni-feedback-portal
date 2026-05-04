import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';
import { SearchService } from './search.service';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

const SIMILARITY_READ_THRESHOLD = 0.7;
const SIMILARITY_READ_MAX = 20;

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Post()
  generateEmbedding(@Body() body: { text: string }) {
    return this.searchService.generateEmbedding(body.text);
  }

  /** Read-only: embed from DB text + vector + rerank (does not persist links). */
  @Public()
  @Get(':id/similarity')
  async findSimilarity(@Param('id') feedbackId: string) {
    const row = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
      select: {
        departmentId: true,
        subject: true,
        description: true,
        currentStatus: true,
      },
    });
    if (!row) {
      throw new NotFoundException('Feedback not found');
    }
    if (
      row.currentStatus === FeedbackStatus.RESOLVED ||
      row.currentStatus === FeedbackStatus.REJECTED
    ) {
      return { targets: [] as { targetFeedbackId: string; score: number }[] };
    }

    const textForEmbed = `${String(row.subject ?? '')} ${String(row.description ?? '')}`;
    const embedding = await this.searchService.generateEmbedding(textForEmbed);
    const vectorString = `[${embedding.join(',')}]`;
    const vectorCandidates = await this.searchService.vectorSearch({
      embeddingText: vectorString,
      departmentId: row.departmentId,
      sourceFeedbackId: feedbackId,
      similarityThreshold: SIMILARITY_READ_THRESHOLD,
    });
    const targets = await this.searchService.scoreSimilarityForCandidates(
      String(row.description ?? ''),
      vectorCandidates,
      {
        maxResults: SIMILARITY_READ_MAX,
        excludeFeedbackId: feedbackId,
      },
    );
    return { targets };
  }
}
