/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  FeedbackDepartmentCosineRow,
  FeedbackVectorCandidate,
} from './feedback-similarity.types';

const FEEDBACK_SIMILARITY_VECTOR_CANDIDATE_LIMIT = 100;
const FEEDBACK_SIMILARITY_MIN_VECTOR_SIMILARITY = 0.65;

const FEEDBACK_SIMILARITY_EXCLUDED_CANDIDATE_STATUSES: readonly FeedbackStatus[] =
  [
    FeedbackStatus.RESOLVED,
    FeedbackStatus.REJECTED,
    FeedbackStatus.VIOLATED_CONTENT,
    FeedbackStatus.AI_REVIEWING,
    FeedbackStatus.AI_REVIEW_FAILED,
  ];

function feedbackSimilarityExcludedStatusesSqlInList(): string {
  return FEEDBACK_SIMILARITY_EXCLUDED_CANDIDATE_STATUSES.map(
    (s) => `'${s}'`,
  ).join(', ');
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

@Injectable()
export class FeedbackEmbeddingService {
  constructor(private readonly prisma: PrismaService) {}

  /** Upsert `FeedbackEmbeddings` sau khi đã có vector từ {@link CohereClientService.generateEmbedding}. */
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

  async findDepartmentPendingCosineRows(
    departmentId: string,
    embedding: number[],
  ): Promise<FeedbackDepartmentCosineRow[]> {
    const vectorString = `[${embedding.join(',')}]`;

    return this.prisma.$queryRaw<FeedbackDepartmentCosineRow[]>`
      SELECT
        f.id AS "feedbackId",
        f.subject AS "subject",
        f.description AS "description",
        f."currentStatus" AS "currentStatus",
        CASE
          WHEN fe.embedding IS NULL THEN NULL
          ELSE (1 - (fe.embedding <=> ${vectorString}::vector))::double precision
        END AS "similarity"
      FROM "Feedbacks" f
      LEFT JOIN "FeedbackEmbeddings" fe ON fe."feedbackId" = f.id
      WHERE f."departmentId" = ${departmentId}::uuid
        AND f."currentStatus" = ${FeedbackStatus.PENDING}::"FeedbackStatus"
      ORDER BY "similarity" DESC NULLS LAST, f."createdAt" DESC
    `;
  }
}
