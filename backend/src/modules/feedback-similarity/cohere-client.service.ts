import { Injectable } from '@nestjs/common';
import { CohereClient } from 'cohere-ai';
import {
  FeedbackSimilarityRerankCandidate,
  FeedbackSimilarityTarget,
} from './type/feedback-similarity.types';

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

function clampRerankScore(score: number): number {
  return Math.min(1, Math.max(0, score));
}

@Injectable()
export class CohereClientService {
  private readonly cohere: CohereClient;

  constructor() {
    this.cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return this.embedWithInputType(text, 'search_document');
  }

  async generateQueryEmbedding(text: string): Promise<number[]> {
    return this.embedWithInputType(text, 'search_query');
  }

  private async embedWithInputType(
    text: string,
    inputType: 'search_document' | 'search_query',
  ): Promise<number[]> {
    try {
      const cleaned = stripHtml(text);
      const embed = await this.cohere.embed({
        texts: [cleaned],
        model: 'embed-multilingual-v3.0',
        inputType,
        embeddingTypes: ['float'],
      });

      return (embed.embeddings as { float: number[][] }).float[0];
    } catch (error) {
      console.error('Lỗi gọi Cohere SDK:', error);
      throw error;
    }
  }

  async scoreSimilarityForCandidates(
    queryText: string,
    candidates: FeedbackSimilarityRerankCandidate[],
    options?: {
      maxResults?: number;
      excludeFeedbackId?: string;
    },
  ): Promise<FeedbackSimilarityTarget[]> {
    const maxResults = options?.maxResults ?? 20;
    const excludeId = options?.excludeFeedbackId;
    const filtered = candidates.filter(
      (c) => !excludeId || c.feedbackId !== excludeId,
    );
    if (filtered.length === 0) {
      return [];
    }

    const query = stripHtml(String(queryText ?? ''));
    const documents = filtered.map((c) =>
      stripHtml(`${String(c.subject ?? '')} ${String(c.description ?? '')}`),
    );

    try {
      const rerankResponse = await this.cohere.rerank({
        model: 'rerank-multilingual-v3.0',
        query,
        documents,
        topN: filtered.length,
      });

      return rerankResponse.results
        .slice(0, maxResults)
        .map((result: { index: number; relevanceScore: number }) => ({
          targetFeedbackId: filtered[result.index].feedbackId,
          score: clampRerankScore(result.relevanceScore),
        }));
    } catch (error) {
      console.error('Lỗi khi gọi Cohere Rerank:', error);
      return [];
    }
  }
}
