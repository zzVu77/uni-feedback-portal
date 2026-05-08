/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';
import { CohereClient } from 'cohere-ai';
import { PrismaService } from '../prisma/prisma.service';

const FEEDBACK_SIMILARITY_VECTOR_CANDIDATE_LIMIT = 100;
const FEEDBACK_SIMILARITY_MIN_VECTOR_SIMILARITY = 0.7;
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

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

function parseVectorString(vectorText: string): number[] {
  const normalized = vectorText.trim();
  if (!normalized.startsWith('[') || !normalized.endsWith(']')) {
    return [];
  }
  const payload = normalized.slice(1, -1).trim();
  if (!payload) {
    return [];
  }
  return payload
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value));
}

export type FeedbackSimilarityTarget = {
  targetFeedbackId: string;
  score: number;
};

export type FeedbackSimilaritySource = {
  sourceFeedbackId: string;
  score: number;
};

export type FeedbackVectorCandidate = {
  feedbackId: string;
  subject: string | null;
  description: string | null;
  vectorSimilarity: number;
};

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

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const cleaned = stripHtml(text);
      console.log('Text sau khi làm sạch:', cleaned);
      const embed = await this.cohere.embed({
        texts: [cleaned],
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

  /** Upsert `FeedbackEmbeddings` sau khi đã có vector từ {@link generateEmbedding}. */
  async saveFeedbackEmbedding(
    feedbackId: string,
    embedding: number[],
  ): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO "FeedbackEmbeddings" (id, "feedbackId", embedding)
      VALUES (gen_random_uuid(), ${feedbackId}::uuid, ${embedding}::vector)
      ON CONFLICT ("feedbackId") DO UPDATE SET embedding = EXCLUDED.embedding
    `;
  }

  async getFeedbackEmbedding(feedbackId: string): Promise<number[] | null> {
    const rows = await this.prisma.$queryRaw<{ embeddingText: string }[]>`
      SELECT embedding::text as "embeddingText"
      FROM "FeedbackEmbeddings"
      WHERE "feedbackId" = ${feedbackId}::uuid
      LIMIT 1
    `;
    const embeddingText = rows[0]?.embeddingText;
    if (!embeddingText) {
      return null;
    }
    const vector = parseVectorString(embeddingText);
    return vector.length > 0 ? vector : null;
  }

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

  /** Thay toàn bộ cạnh `source → *` trong `FeedbackSimilarityLink`. */
  async saveSimilarityLinksForSource(
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

  /** Thay toàn bộ cạnh `* → target` trong `FeedbackSimilarityLink`. */
  async saveSimilarityLinksForTarget(
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

  async handleSimilarityAfterFeedbackCreated(
    feedbackId: string,
  ): Promise<void> {
    try {
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
        throw new Error('Không tìm thấy feedback.');
      }

      if (
        row.currentStatus === FeedbackStatus.RESOLVED ||
        row.currentStatus === FeedbackStatus.REJECTED
      ) {
        await this.saveSimilarityLinksForSource(feedbackId, []);
        return;
      }

      const textForEmbed = `${String(row.subject ?? '')} ${String(row.description ?? '')}`;
      const existingEmbedding = await this.getFeedbackEmbedding(feedbackId);
      const embedding =
        existingEmbedding ?? (await this.generateEmbedding(textForEmbed));
      if (!existingEmbedding) {
        await this.saveFeedbackEmbedding(feedbackId, embedding);
      }

      const vectorString = `[${embedding.join(',')}]`;
      const vectorCandidates = await this.vectorSearch({
        embeddingText: vectorString,
        departmentId: row.departmentId,
        sourceFeedbackId: feedbackId,
      });
      console.log('vectorCandidates', vectorCandidates);
      const targets = await this.scoreSimilarityForCandidates(
        String(row.description ?? ''),
        vectorCandidates,
        {
          maxResults: FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS,
          excludeFeedbackId: feedbackId,
        },
      );
      console.log('targets', targets);
      await this.saveSimilarityLinksForSource(feedbackId, targets);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Không tìm thấy feedback')) {
        await this.saveSimilarityLinksForSource(feedbackId, []);
        return;
      }
      throw err;
    }
  }

  async handleSimilarityAfterFeedbackUpdated(
    feedbackId: string,
    priorIncomingSourceIds: string[],
  ): Promise<void> {
    try {
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
        throw new Error('Không tìm thấy feedback.');
      }

      if (
        row.currentStatus === FeedbackStatus.RESOLVED ||
        row.currentStatus === FeedbackStatus.REJECTED
      ) {
        await this.saveSimilarityLinksForSource(feedbackId, []);
        await this.saveSimilarityLinksForTarget(feedbackId, []);
        return;
      }

      const textForEmbed = `${String(row.subject ?? '')} ${String(row.description ?? '')}`;
      const embedding = await this.generateEmbedding(textForEmbed);
      await this.saveFeedbackEmbedding(feedbackId, embedding);

      const vectorString = `[${embedding.join(',')}]`;
      const vectorCandidates = await this.vectorSearch({
        embeddingText: vectorString,
        departmentId: row.departmentId,
        sourceFeedbackId: feedbackId,
      });
      const targets = await this.scoreSimilarityForCandidates(
        String(row.description ?? ''),
        vectorCandidates,
        {
          maxResults: FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS,
          excludeFeedbackId: feedbackId,
        },
      );
      await this.saveSimilarityLinksForSource(feedbackId, targets);

      const pivot = await this.prisma.feedbacks.findUnique({
        where: { id: feedbackId },
        select: { id: true, subject: true, description: true },
      });
      const pivotCandidate = pivot
        ? [
            {
              feedbackId: pivot.id,
              subject: pivot.subject,
              description: pivot.description,
            },
          ]
        : [];

      const distinct = [...new Set(priorIncomingSourceIds)].filter(
        (id) => id !== feedbackId,
      );
      const incoming: FeedbackSimilaritySource[] = [];
      for (const sourceId of distinct) {
        try {
          const source = await this.prisma.feedbacks.findUnique({
            where: { id: sourceId },
            select: { description: true },
          });
          if (!source || pivotCandidate.length === 0) {
            continue;
          }
          const ranked = await this.scoreSimilarityForCandidates(
            String(source.description ?? ''),
            pivotCandidate,
            { maxResults: 1, excludeFeedbackId: sourceId },
          );
          if (ranked.length > 0 && ranked[0].targetFeedbackId === feedbackId) {
            incoming.push({
              sourceFeedbackId: sourceId,
              score: ranked[0].score,
            });
          }
        } catch {
          continue;
        }
      }
      await this.saveSimilarityLinksForTarget(feedbackId, incoming);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Không tìm thấy feedback')) {
        await this.saveSimilarityLinksForSource(feedbackId, []);
        await this.saveSimilarityLinksForTarget(feedbackId, []);
        return;
      }
      throw err;
    }
  }
}
