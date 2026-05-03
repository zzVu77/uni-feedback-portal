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

/** Incoming edges when the pivot feedback is the target (source → pivot). */
export type FeedbackSimilaritySource = {
  sourceFeedbackId: string;
  score: number;
};

/** Row from pgvector neighbour search (same department, before rerank). */
export type FeedbackVectorCandidate = {
  feedbackId: string;
  subject: string | null;
  description: string | null;
  vectorSimilarity: number;
};

/** Minimal shape for Cohere rerank (full discovery or fixed ID list). */
export type FeedbackSimilarityRerankCandidate = {
  feedbackId: string;
  subject?: string | null;
  description?: string | null;
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

  /**
   * Same-department pgvector neighbours for a source embedding (excludes source id).
   */
  async vectorSearch(params: {
    embeddingText: string;
    departmentId: string;
    sourceFeedbackId: string;
    similarityThreshold?: number;
    limit?: number;
  }): Promise<FeedbackVectorCandidate[]> {
    const similarityThreshold =
      params.similarityThreshold ?? FEEDBACK_SIMILARITY_MIN_VECTOR_SIMILARITY;
    const limit = params.limit ?? FEEDBACK_SIMILARITY_VECTOR_CANDIDATE_LIMIT;
    const excludedStatuses = feedbackSimilarityExcludedStatusesSqlInList();
    const rows: any[] = await this.prisma.$queryRawUnsafe(
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
      params.embeddingText,
      params.departmentId,
      params.sourceFeedbackId,
      similarityThreshold,
      limit,
    );

    return rows.map((r) => ({
      feedbackId: r.feedbackId as string,
      subject: (r.subject ?? null) as string | null,
      description: (r.description ?? null) as string | null,
      vectorSimilarity: Number(r.similarity),
    }));
  }

  /**
   * Cohere rerank for a fixed candidate set. Used after {@link vectorSearch} or with IDs loaded from DB.
   */
  async scoreSimilarityForCandidates(
    queryText: string,
    candidates: FeedbackSimilarityRerankCandidate[],
    options?: {
      maxResults?: number;
      excludeFeedbackId?: string;
    },
  ): Promise<FeedbackSimilarityTarget[]> {
    const maxResults =
      options?.maxResults ?? FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS;
    const excludeId = options?.excludeFeedbackId;
    const filtered = candidates.filter(
      (c) => !excludeId || c.feedbackId !== excludeId,
    );
    if (filtered.length === 0) {
      return [];
    }

    const query = this.cleanText(String(queryText ?? ''));
    const documents = filtered.map((c) =>
      this.cleanText(
        `${String(c.subject ?? '')} ${String(c.description ?? '')}`,
      ),
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

  /**
   * Loads source description and candidate rows by id, then {@link scoreSimilarityForCandidates}.
   */
  async scoreSimilarityForCandidateIds(
    sourceFeedbackId: string,
    candidateFeedbackIds: string[],
    options?: { maxResults?: number },
  ): Promise<FeedbackSimilarityTarget[]> {
    const unique = [...new Set(candidateFeedbackIds)].filter(
      (id) => id !== sourceFeedbackId,
    );
    if (unique.length === 0) {
      return [];
    }

    const source = await this.prisma.feedbacks.findUnique({
      where: { id: sourceFeedbackId },
      select: { description: true },
    });
    if (!source) {
      throw new Error('Không tìm thấy feedback nguồn.');
    }

    const feedbacks = await this.prisma.feedbacks.findMany({
      where: { id: { in: unique } },
      select: { id: true, subject: true, description: true },
    });

    const byId = new Map(feedbacks.map((f) => [f.id, f] as const));
    const candidates: FeedbackSimilarityRerankCandidate[] = [];
    for (const id of unique) {
      const f = byId.get(id);
      if (f) {
        candidates.push({
          feedbackId: f.id,
          subject: f.subject,
          description: f.description,
        });
      }
    }

    return this.scoreSimilarityForCandidates(
      String(source.description ?? ''),
      candidates,
      { maxResults: options?.maxResults, excludeFeedbackId: sourceFeedbackId },
    );
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

    const vectorString = originalData[0].embeddingText;
    const departmentId = originalData[0].departmentId;
    const originalDescription = originalData[0].description;

    if (!vectorString) {
      throw new Error('Dữ liệu embedding bị trống.');
    }

    const vectorCandidates = await this.vectorSearch({
      embeddingText: vectorString,
      departmentId,
      sourceFeedbackId: feedbackId,
      similarityThreshold,
    });

    const targets = await this.scoreSimilarityForCandidates(
      String(originalDescription ?? ''),
      vectorCandidates,
      {
        maxResults: FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS,
        excludeFeedbackId: feedbackId,
      },
    );

    return { targets };
  }

  /**
   * Replaces all persisted similarity edges for a source feedback in one transaction.
   * When there are no targets, only old links are removed.
   */
  async replaceSimilarityLinksForSource(
    sourceFeedbackId: string,
    targets: FeedbackSimilarityTarget[],
  ): Promise<void> {
    const rows = targets.filter((t) => t.targetFeedbackId !== sourceFeedbackId);

    if (rows.length === 0) {
      await this.prisma.feedbackSimilarityLink.deleteMany({
        where: { sourceFeedbackId },
      });
      return;
    }

    await this.prisma.$transaction([
      this.prisma.feedbackSimilarityLink.deleteMany({
        where: { sourceFeedbackId },
      }),
      this.prisma.feedbackSimilarityLink.createMany({
        data: rows.map((t) => ({
          sourceFeedbackId,
          targetFeedbackId: t.targetFeedbackId,
          score: t.score,
        })),
        skipDuplicates: true,
      }),
    ]);
  }

  /**
   * Replaces all persisted similarity edges that point at a given target feedback.
   * Use after the target’s embedding/text changes and you have new pair scores from each source.
   * When there are no sources, only old incoming links are removed.
   */
  async replaceSimilarityLinksForTarget(
    targetFeedbackId: string,
    sources: FeedbackSimilaritySource[],
  ): Promise<void> {
    const rows = sources.filter((s) => s.sourceFeedbackId !== targetFeedbackId);

    if (rows.length === 0) {
      await this.prisma.feedbackSimilarityLink.deleteMany({
        where: { targetFeedbackId },
      });
      return;
    }

    await this.prisma.$transaction([
      this.prisma.feedbackSimilarityLink.deleteMany({
        where: { targetFeedbackId },
      }),
      this.prisma.feedbackSimilarityLink.createMany({
        data: rows.map((s) => ({
          sourceFeedbackId: s.sourceFeedbackId,
          targetFeedbackId,
          score: s.score,
        })),
        skipDuplicates: true,
      }),
    ]);
  }
}
