import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CohereClientService } from './cohere-client.service';
import { FeedbackEmbeddingService } from './feedback-embedding.service';
import {
  FeedbackDepartmentCosineRow,
  FeedbackDepartmentRerankRow,
  FeedbackSimilaritySource,
  FeedbackSimilarityTarget,
} from './feedback-similarity.types';

const FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS = 20;

@Injectable()
export class FeedbackSimilarityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cohereClient: CohereClientService,
    private readonly feedbackEmbedding: FeedbackEmbeddingService,
  ) {}

  async findSimilarity(feedbackId: string): Promise<{
    targets: FeedbackSimilarityTarget[];
  }> {
    const exists = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('Feedback not found');
    }

    const links = await this.prisma.feedbackSimilarityLink.findMany({
      where: {
        OR: [
          { sourceFeedbackId: feedbackId },
          { targetFeedbackId: feedbackId },
        ],
      },
      select: {
        sourceFeedbackId: true,
        targetFeedbackId: true,
        score: true,
      },
    });

    const scoreByPeer = new Map<string, number>();
    for (const link of links) {
      const peerId =
        link.sourceFeedbackId === feedbackId
          ? link.targetFeedbackId
          : link.sourceFeedbackId;
      const prev = scoreByPeer.get(peerId) ?? 0;
      scoreByPeer.set(peerId, Math.max(prev, link.score));
    }

    const targets = [...scoreByPeer.entries()]
      .map(([targetFeedbackId, score]) => ({ targetFeedbackId, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS);

    return { targets };
  }

  async findDepartmentCosineSimilarity(
    feedbackId: string,
  ): Promise<{ feedbackId: string; results: FeedbackDepartmentCosineRow[] }> {
    const row = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
      select: {
        id: true,
        departmentId: true,
      },
    });
    if (!row) {
      throw new NotFoundException('Feedback not found');
    }

    const embedding =
      await this.feedbackEmbedding.getFeedbackEmbedding(feedbackId);
    if (!embedding) {
      throw new NotFoundException('Feedback embedding not found');
    }

    const results =
      await this.feedbackEmbedding.findDepartmentPendingCosineRows(
        row.departmentId,
        embedding,
      );

    return { feedbackId, results };
  }

  async findDepartmentRerankTest(
    feedbackId: string,
  ): Promise<{ feedbackId: string; targets: FeedbackDepartmentRerankRow[] }> {
    const row = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
      select: {
        id: true,
        subject: true,
        description: true,
        departmentId: true,
      },
    });
    if (!row) {
      throw new NotFoundException('Feedback not found');
    }

    const candidates = await this.prisma.feedbacks.findMany({
      where: {
        departmentId: row.departmentId,
        currentStatus: FeedbackStatus.PENDING,
      },
      select: {
        id: true,
        subject: true,
        description: true,
      },
    });
    const queryText = String(row.description ?? '');
    const targets = await this.cohereClient.scoreSimilarityForCandidates(
      queryText,
      candidates.map((candidate) => ({
        feedbackId: candidate.id,
        subject: candidate.subject,
        description: candidate.description,
      })),
      {
        maxResults: candidates.length,
      },
    );

    return { feedbackId, targets };
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
      const existingEmbedding =
        await this.feedbackEmbedding.getFeedbackEmbedding(feedbackId);
      const embedding =
        existingEmbedding ??
        (await this.cohereClient.generateEmbedding(textForEmbed));
      if (!existingEmbedding) {
        await this.feedbackEmbedding.saveFeedbackEmbedding(
          feedbackId,
          embedding,
        );
      }

      const queryVector =
        await this.cohereClient.generateQueryEmbedding(textForEmbed);
      const vectorString = `[${queryVector.join(',')}]`;
      const vectorCandidates = await this.feedbackEmbedding.vectorSearch({
        embeddingText: vectorString,
        departmentId: row.departmentId,
        sourceFeedbackId: feedbackId,
      });
      // console.log('vectorCandidates', vectorCandidates);
      const targets = await this.cohereClient.scoreSimilarityForCandidates(
        String(row.description ?? ''),
        vectorCandidates,
        {
          maxResults: FEEDBACK_SIMILARITY_MAX_PERSISTED_LINKS,
          excludeFeedbackId: feedbackId,
        },
      );
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
        throw new NotFoundException('Feedback not found');
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
      const embedding = await this.cohereClient.generateEmbedding(textForEmbed);
      await this.feedbackEmbedding.saveFeedbackEmbedding(feedbackId, embedding);

      const queryVector =
        await this.cohereClient.generateQueryEmbedding(textForEmbed);
      const vectorString = `[${queryVector.join(',')}]`;
      const vectorCandidates = await this.feedbackEmbedding.vectorSearch({
        embeddingText: vectorString,
        departmentId: row.departmentId,
        sourceFeedbackId: feedbackId,
      });
      const targets = await this.cohereClient.scoreSimilarityForCandidates(
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
          const ranked = await this.cohereClient.scoreSimilarityForCandidates(
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
