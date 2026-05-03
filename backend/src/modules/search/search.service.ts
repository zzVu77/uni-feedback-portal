/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';
import { CohereClient } from 'cohere-ai';
import { PrismaService } from '../prisma/prisma.service';

/** Max pgvector rows (same department) before Cohere rerank. */
const FEEDBACK_SIMILARITY_VECTOR_CANDIDATE_LIMIT = 100;

/** Min cosine similarity 1 - (embedding <=> query) for candidates. */
const FEEDBACK_SIMILARITY_MIN_VECTOR_SIMILARITY = 0.7;

/** Max targets per source after rerank (for persisted links / API slice). */
const FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS = 20;

const FEEDBACK_SIMILARITY_EXCLUDED_CANDIDATE_STATUSES: readonly FeedbackStatus[] =
  [FeedbackStatus.RESOLVED, FeedbackStatus.REJECTED];

function feedbackSimilarityExcludedStatusesSqlInList(): string {
  return FEEDBACK_SIMILARITY_EXCLUDED_CANDIDATE_STATUSES.map(
    (s) => `'${s}'`,
  ).join(', ');
}

function clampRerankScore(score: number): number {
  return Math.min(1, Math.max(0, score));
}

export type FeedbackSimilarityTarget = {
  targetFeedbackId: string;
  score: number;
};

@Injectable()
export class SearchService {
  private cohere: CohereClient;
  constructor(private readonly prisma: PrismaService) {
    this.cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
  }

  private cleanText(text: string): string {
    return text.replace(/<[^>]*>/g, '').trim();
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      this.cleanText(text);
      console.log('Text sau khi làm sạch:', text);
      const embed = await this.cohere.embed({
        texts: [text],
        model: 'embed-multilingual-v3.0',
        inputType: 'search_document',
        embeddingTypes: ['float'],
      });

      return (embed.embeddings as { float: number[][] }).float[0];
    } catch (error) {
      console.error('Lỗi gọi Cohere SDK:', error);
      throw error;
    }
  }

  async findSimilarity(
    feedbackId: string,
    similarityThreshold: number = FEEDBACK_SIMILARITY_MIN_VECTOR_SIMILARITY,
  ): Promise<{ targets: FeedbackSimilarityTarget[] }> {
    const originalData: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT 
        fe.embedding::text as "embeddingText", 
        f."departmentId",
        f.subject,
        f.description,
        f."currentStatus"
     FROM "FeedbackEmbeddings" as fe 
     JOIN "Feedbacks" as f ON fe."feedbackId" = f.id 
     WHERE fe."feedbackId" = $1::uuid`,
      feedbackId,
    );

    if (!originalData || originalData.length === 0) {
      throw new Error('Không tìm thấy feedback hoặc embedding.');
    }

    const sourceStatus = originalData[0].currentStatus as FeedbackStatus;
    if (
      sourceStatus !== FeedbackStatus.PENDING &&
      sourceStatus !== FeedbackStatus.IN_PROGRESS
    ) {
      return { targets: [] };
    }

    // Dữ liệu trả về từ ::text sẽ có dạng "[0.1,0.2,...]"
    const vectorString = originalData[0].embeddingText;
    const departmentId = originalData[0].departmentId;
    const originalDescription = originalData[0].description;

    if (!vectorString) {
      throw new Error('Dữ liệu embedding bị trống.');
    }

    // 2. Query tìm kiếm tương đồng
    // Lưu ý: $1 đã là chuỗi "[...]" nên chỉ cần ép kiểu ::vector trong SQL
    const excludedStatuses = feedbackSimilarityExcludedStatusesSqlInList();
    const similarFeedbacks: any[] = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM (
      SELECT
        fe."feedbackId",
        f.subject,
        f.description,
        1 - (fe.embedding <=> $1::vector) as similarity
      FROM "FeedbackEmbeddings" as fe
      JOIN "Feedbacks" as f ON fe."feedbackId" = f.id
      WHERE 
        f."departmentId" = $2::uuid 
        AND fe."feedbackId" != $3::uuid
        AND f."currentStatus"::text NOT IN (${excludedStatuses})
        AND (1 - (fe.embedding <=> $1::vector)) >= $4::double precision
    ) AS sub_query
    ORDER BY similarity DESC
    LIMIT $5::int
    `,
      vectorString,
      departmentId,
      feedbackId,
      similarityThreshold,
      FEEDBACK_SIMILARITY_VECTOR_CANDIDATE_LIMIT,
    );

    let targets: FeedbackSimilarityTarget[] = [];

    if (similarFeedbacks.length > 0) {
      const query = this.cleanText(String(originalDescription ?? ''));
      const documents = similarFeedbacks.map((f) =>
        this.cleanText(
          `${String(f.subject ?? '')} ${String(f.description ?? '')}`,
        ),
      );
      try {
        const rerankResponse = await this.cohere.rerank({
          model: 'rerank-multilingual-v3.0',
          query: query,
          documents: documents,
          topN: similarFeedbacks.length,
        });

        targets = rerankResponse.results
          .slice(0, FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS)
          .map((result: { index: number; relevanceScore: number }) => ({
            targetFeedbackId: similarFeedbacks[result.index]
              .feedbackId as string,
            score: clampRerankScore(result.relevanceScore),
          }));
      } catch (error) {
        console.error('Lỗi khi gọi Cohere Rerank:', error);
      }
    }

    return { targets };
  }
}
