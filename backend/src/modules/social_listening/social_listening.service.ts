/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/social_listening/social_listening.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GithubActionService } from '../github-action/github-action.service';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { GetTrendingIssuesDto } from './dto/get-trending-issues.dto';
import { GetPostCommentsDto } from './dto/get-post-comments.dto';

@Injectable()
export class SocialListeningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly githubActionService: GithubActionService,
  ) {}

  private getDateFilter(
    dto: GetTrendingIssuesDto,
  ): Prisma.DateTimeFilter | undefined {
    if (!dto.startDate && !dto.endDate) return undefined;

    return {
      ...(dto.startDate && { gte: new Date(dto.startDate) }),
      ...(dto.endDate && {
        lt: new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      }),
    };
  }

  /**
   * Retrieves KPI Overview for social listening.
   */
  async getKPIOverview(dto: GetTrendingIssuesDto) {
    const dateFilter = this.getDateFilter(dto);
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(dateFilter && { postedAt: dateFilter }),
      ...(dto.groupUrl && {
        postLink: { contains: dto.groupUrl, mode: 'insensitive' },
      }),
    };

    const [aggregate, sentimentGroups] = await Promise.all([
      this.prisma.dashboardTrendingIssues.aggregate({
        where,
        _count: { postId: true },
        _sum: {
          reactionCount: true,
          commentCount: true,
        },
      }),
      this.prisma.dashboardTrendingIssues.groupBy({
        where,
        by: ['sentimentLabel'],
        _count: { postId: true },
      }),
    ]);

    const totalPosts = aggregate._count.postId || 0;
    const counts: Record<string, number> = {
      'Tích cực': 0,
      'Tiêu cực': 0,
      'Trung lập': 0,
      'Stress lo âu': 0,
    };

    sentimentGroups.forEach((group) => {
      if (counts.hasOwnProperty(group.sentimentLabel)) {
        counts[group.sentimentLabel] = group._count.postId;
      }
    });

    // Find dominant sentiment
    let dominantSentiment = 'Chưa rõ';
    let maxCount = 0;

    for (const [label, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantSentiment = label;
      }
    }

    const percentage =
      totalPosts > 0 ? Math.round((maxCount / totalPosts) * 100) : 0;
    const sentimentTrendText =
      totalPosts > 0
        ? `Chiếm ${percentage}% tổng số bài đăng`
        : 'Chưa có dữ liệu bài đăng';

    return {
      totalPosts,
      totalReactions: aggregate._sum.reactionCount || 0,
      totalComments: aggregate._sum.commentCount || 0,
      negativePostsCount: counts['Tiêu cực'] + counts['Stress lo âu'],
      dominantSentiment,
      sentimentTrendText,
    };
  }

  /**
   * Retrieves sentiment trend grouped by date.
   */
  async getSentimentTrend(dto: GetTrendingIssuesDto) {
    // Using raw query for grouping by date string in Postgres
    // We need to handle parameters for the where clause safely
    const whereConditions: string[] = [];
    const params: any[] = [];

    if (dto.startDate) {
      whereConditions.push(`posted_at >= $${params.length + 1}`);
      params.push(new Date(dto.startDate));
    }

    if (dto.endDate) {
      whereConditions.push(`posted_at < $${params.length + 1}`);
      params.push(
        new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      );
    }

    if (dto.groupUrl) {
      whereConditions.push(`post_link ILIKE $${params.length + 1}`);
      params.push(`%${dto.groupUrl}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    const query = `
      SELECT 
        TO_CHAR(posted_at, 'YYYY-MM-DD') as "dateStr",
        TO_CHAR(posted_at, 'DD/MM') as "displayDate",
        COUNT(*) FILTER (WHERE sentiment_label = 'Tích cực') as positive,
        COUNT(*) FILTER (WHERE sentiment_label = 'Tiêu cực') as negative,
        COUNT(*) FILTER (WHERE sentiment_label = 'Trung lập') as neutral,
        COUNT(*) FILTER (WHERE sentiment_label = 'Stress lo âu') as "stressAnxiety"
      FROM dashboard_trending_issues
      ${whereClause}
      GROUP BY "dateStr", "displayDate"
      ORDER BY "dateStr" ASC
    `;

    const results: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    return results.map((item) => ({
      dateStr: item.dateStr,
      displayDate: item.displayDate,
      positive: Number(item.positive),
      negative: Number(item.negative),
      neutral: Number(item.neutral),
      stressAnxiety: Number(item.stressAnxiety),
    }));
  }

  /**
   * Retrieves topic distribution.
   */
  async getTopicDistribution(dto: GetTrendingIssuesDto) {
    const dateFilter = this.getDateFilter(dto);
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(dateFilter && { postedAt: dateFilter }),
      ...(dto.groupUrl && {
        postLink: { contains: dto.groupUrl, mode: 'insensitive' },
      }),
    };

    const groups = await this.prisma.dashboardTrendingIssues.groupBy({
      where,
      by: ['topic'],
      _count: { postId: true },
      orderBy: {
        _count: {
          postId: 'desc',
        },
      },
      take: 10,
    });

    return groups.map((g) => ({
      topic: g.topic,
      count: g._count.postId,
    }));
  }

  /**
   * Retreives trending issues with custom sorting:
   * 1. sentimentLabel: Tiêu cực > Tích cực > Trung lập.
   * 2. engagementScore (reactionCount + commentCount) descending.
   * 3. postedAt descending.
   */
  async getTrendingIssues(dto: GetTrendingIssuesDto) {
    const { page = 1, limit = 10, topic, sentimentLabel } = dto;
    const skip = (page - 1) * limit;

    const dateFilter = this.getDateFilter(dto);

    // 1. build where clause for Prisma count
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(topic && { topic: { contains: topic, mode: 'insensitive' } }),
      ...(sentimentLabel && { sentimentLabel }),
      ...(dateFilter && { postedAt: dateFilter }),
      ...(dto.groupUrl && {
        postLink: { contains: dto.groupUrl, mode: 'insensitive' },
      }),
    };

    // 2. build Raw SQL to handle custom sorting logic
    const whereConditions: string[] = [];
    const params: any[] = [];

    if (topic) {
      whereConditions.push(`topic ILIKE $${params.length + 1}`);
      params.push(`%${topic}%`);
    }

    if (sentimentLabel) {
      whereConditions.push(`sentiment_label = $${params.length + 1}`);
      params.push(sentimentLabel);
    }

    if (dto.startDate) {
      whereConditions.push(`posted_at >= $${params.length + 1}`);
      params.push(new Date(dto.startDate));
    }

    if (dto.endDate) {
      whereConditions.push(`posted_at < $${params.length + 1}`);
      params.push(
        new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      );
    }

    if (dto.groupUrl) {
      whereConditions.push(`post_link ILIKE $${params.length + 1}`);
      params.push(`%${dto.groupUrl}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    const query = `
      SELECT *
      FROM dashboard_trending_issues
      ${whereClause}
      ORDER BY 
        CASE sentiment_label 
          WHEN 'Tiêu cực' THEN 1 
          WHEN 'Stress lo âu' THEN 2
          WHEN 'Tích cực' THEN 3 
          WHEN 'Trung lập' THEN 4 
          ELSE 5 
        END ASC,
        engagement_score DESC,
        posted_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const [total, rawData] = await Promise.all([
      this.prisma.dashboardTrendingIssues.count({ where }),
      this.prisma.$queryRawUnsafe<any[]>(query, ...params, limit, skip),
    ]);

    // 4. Map raw data to expected format, ensuring all fields are present and correctly typed
    const data = rawData.map((item) => ({
      postId: item.post_id || item.postId,
      author: item.author,
      content: item.content,
      postLink: item.post_link || item.postLink,
      postedAt: item.posted_at || item.postedAt,
      reactionCount: Number(item.reaction_count || item.reactionCount || 0),
      commentCount: Number(item.comment_count || item.commentCount || 0),
      engagementScore: Number(
        item.engagement_score || item.engagementScore || 0,
      ),
      topic: item.topic,
      sentimentScore: Number(item.sentiment_score || item.sentimentScore || 0),
      aiSummary: item.ai_summary || item.aiSummary,
      sentimentLabel: item.sentiment_label || item.sentimentLabel,
      analyzedAt: item.analyzed_at || item.analyzedAt,
      isCommentsCrawled: Boolean(
        item.is_comments_crawled ?? item.isCommentsCrawled ?? false,
      ),
      commentsAiSummary:
        item.comments_ai_summary || item.commentsAiSummary || null,
      negativeCommentsRatio:
        item.negative_comments_ratio != null
          ? Number(item.negative_comments_ratio)
          : item.negativeCommentsRatio != null
            ? Number(item.negativeCommentsRatio)
            : null,
      urgencyLevel: item.urgency_level || item.urgencyLevel || 'NORMAL',
    }));

    return {
      results: data,
      total: total,
    };
  }

  async getClassificationSentiment(dto: GetTrendingIssuesDto) {
    const whereConditions: string[] = [];
    const params: any[] = [];

    if (dto.startDate) {
      whereConditions.push(`posted_at >= $${params.length + 1}`);
      params.push(new Date(dto.startDate));
    }

    if (dto.endDate) {
      whereConditions.push(`posted_at < $${params.length + 1}`);
      params.push(
        new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      );
    }

    if (dto.groupUrl) {
      whereConditions.push(`post_link ILIKE $${params.length + 1}`);
      params.push(`%${dto.groupUrl}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    const query = `
    SELECT
      sentiment_label as "sentimentLabel",
      COUNT(*) as "count"
    FROM dashboard_trending_issues
    ${whereClause}
    GROUP BY sentiment_label
  `;

    const results: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    const defaultLabels = ['Tích cực', 'Tiêu cực', 'Trung lập', 'Stress lo âu'];
    const mapped: Record<string, number> = Object.fromEntries(
      defaultLabels.map((l) => [l, 0]),
    );

    results.forEach((r) => {
      if (mapped.hasOwnProperty(r.sentimentLabel)) {
        mapped[r.sentimentLabel] = Number(r.count);
      }
    });

    return Object.entries(mapped).map(([sentimentLabel, count]) => ({
      sentimentLabel,
      count,
    }));
  }

  async getPostCountByDate(dto: GetTrendingIssuesDto) {
    const whereConditions: string[] = [];
    const params: any[] = [];
    whereConditions.push(`sentiment_label IN ('Tích cực', 'Tiêu cực')`);

    if (dto.startDate) {
      whereConditions.push(`posted_at >= $${params.length + 1}`);
      params.push(new Date(dto.startDate));
    }

    if (dto.endDate) {
      whereConditions.push(`posted_at < $${params.length + 1}`);
      params.push(
        new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      );
    }

    if (dto.groupUrl) {
      whereConditions.push(`post_link ILIKE $${params.length + 1}`);
      params.push(`%${dto.groupUrl}%`);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const query = `
    SELECT
      TO_CHAR(posted_at, 'YYYY-MM-DD') as "dateStr",
      TO_CHAR(posted_at, 'DD/MM') as "displayDate",
      COUNT(*) as "totalPosts"
    FROM dashboard_trending_issues
    ${whereClause}
    GROUP BY "dateStr", "displayDate"
    ORDER BY "dateStr" ASC
  `;

    const results: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    return results.map((item) => ({
      dateStr: item.dateStr,
      displayDate: item.displayDate,
      totalPosts: Number(item.totalPosts),
    }));
  }
  async getPostsBySentiment(dto: GetTrendingIssuesDto) {
    const whereConditions: string[] = [];
    const params: any[] = [];

    whereConditions.push(`sentiment_label IN ('Tiêu cực', 'Tích cực')`);

    if (dto.startDate) {
      whereConditions.push(`posted_at >= $${params.length + 1}`);
      params.push(new Date(dto.startDate));
    }

    if (dto.endDate) {
      whereConditions.push(`posted_at < $${params.length + 1}`);
      params.push(
        new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      );
    }

    if (dto.groupUrl) {
      whereConditions.push(`post_link ILIKE $${params.length + 1}`);
      params.push(`%${dto.groupUrl}%`);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const query = `
    SELECT *
    FROM dashboard_trending_issues
    ${whereClause}
    ORDER BY
      CASE sentiment_label
        WHEN 'Tiêu cực' THEN 1
        WHEN 'Tích cực' THEN 2
        ELSE 3
      END ASC,
      engagement_score DESC,
      posted_at DESC
  `;

    const rawData = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);

    return rawData.map((item) => ({
      postId: item.post_id || item.postId,
      author: item.author,
      content: item.content,
      postLink: item.post_link || item.postLink,
      postedAt: item.posted_at || item.postedAt,
      reactionCount: Number(item.reaction_count || item.reactionCount || 0),
      commentCount: Number(item.comment_count || item.commentCount || 0),
      engagementScore: Number(
        item.engagement_score || item.engagementScore || 0,
      ),
      topic: item.topic,
      sentimentScore: Number(item.sentiment_score || item.sentimentScore || 0),
      aiSummary: item.ai_summary || item.aiSummary,
      sentimentLabel: item.sentiment_label || item.sentimentLabel,
      analyzedAt: item.analyzed_at || item.analyzedAt,
    }));
  }
  async getTopicSentimentDistribution(dto: GetTrendingIssuesDto) {
    const dateFilter = this.getDateFilter(dto);
    const where: Prisma.DashboardTrendingIssuesWhereInput = {
      ...(dateFilter && { postedAt: dateFilter }),
      sentimentLabel: { in: ['Tích cực', 'Tiêu cực'] }, // ← thêm dòng này
      ...(dto.groupUrl && {
        postLink: { contains: dto.groupUrl, mode: 'insensitive' },
      }),
    };

    const groups = await this.prisma.dashboardTrendingIssues.groupBy({
      where,
      by: ['topic'],
      _count: { postId: true },
      orderBy: {
        _count: {
          postId: 'desc',
        },
      },
      take: 10,
    });

    return groups.map((g) => ({
      topic: g.topic,
      count: g._count.postId,
    }));
  }
  async getUrgentIssues(dto: GetTrendingIssuesDto) {
    const whereConditions: string[] = [];
    const params: any[] = [];

    // Filter by sentiment label 'Tiêu cực' or 'Stress lo âu'
    whereConditions.push(`sentiment_label IN ('Tiêu cực', 'Stress lo âu')`);

    // Filter by ai_summary containing 'nghiêm trọng' (case-insensitive)
    whereConditions.push(`ai_summary ILIKE '%nghiêm trọng%'`);

    if (dto.startDate) {
      whereConditions.push(`posted_at >= $${params.length + 1}`);
      params.push(new Date(dto.startDate));
    }

    if (dto.endDate) {
      whereConditions.push(`posted_at < $${params.length + 1}`);
      params.push(
        new Date(
          new Date(dto.endDate).setDate(new Date(dto.endDate).getDate() + 1),
        ),
      );
    }
    if (dto.analyzedStartDate) {
      whereConditions.push(`analyzed_at >= $${params.length + 1}`);
      params.push(new Date(dto.analyzedStartDate));
    }

    if (dto.analyzedEndDate) {
      whereConditions.push(`analyzed_at < $${params.length + 1}`);
      params.push(
        new Date(
          new Date(dto.analyzedEndDate).setDate(
            new Date(dto.analyzedEndDate).getDate() + 1,
          ),
        ),
      );
    }

    if (dto.groupUrl) {
      whereConditions.push(`post_link ILIKE $${params.length + 1}`);
      params.push(`%${dto.groupUrl}%`);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Order by engagement_score DESC and posted_at DESC
    const query = `
      SELECT *
      FROM dashboard_trending_issues
      ${whereClause}
      ORDER BY
        engagement_score DESC,
        posted_at DESC
    `;

    const rawData = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);

    return rawData.map((item) => ({
      postId: item.post_id || item.postId,
      author: item.author,
      content: item.content,
      postLink: item.post_link || item.postLink,
      postedAt: item.posted_at || item.postedAt,
      reactionCount: Number(item.reaction_count || item.reactionCount || 0),
      commentCount: Number(item.comment_count || item.commentCount || 0),
      engagementScore: Number(
        item.engagement_score || item.engagementScore || 0,
      ),
      topic: item.topic,
      sentimentScore: Number(item.sentiment_score || item.sentimentScore || 0),
      aiSummary: item.ai_summary || item.aiSummary,
      sentimentLabel: item.sentiment_label || item.sentimentLabel,
      analyzedAt: item.analyzed_at || item.analyzedAt,
      isCommentsCrawled: Boolean(
        item.is_comments_crawled ?? item.isCommentsCrawled ?? false,
      ),
      commentsAiSummary:
        item.comments_ai_summary || item.commentsAiSummary || null,
      negativeCommentsRatio:
        item.negative_comments_ratio != null
          ? Number(item.negative_comments_ratio)
          : item.negativeCommentsRatio != null
            ? Number(item.negativeCommentsRatio)
            : null,
      urgencyLevel: item.urgency_level || item.urgencyLevel || 'NORMAL',
    }));
  }

  /**
   * Retrieves full details of a specific social listening post by ID.
   */
  async getPostById(postId: string) {
    const post = await this.prisma.dashboardTrendingIssues.findUnique({
      where: { postId },
    });

    if (!post) {
      throw new NotFoundException(`Bài viết với ID "${postId}" không tồn tại.`);
    }

    return post;
  }

  /**
   * Retrieves detailed comments and sentiment analysis for a specific post.
   */
  async getPostComments(postId: string, dto: GetPostCommentsDto) {
    const post = await this.prisma.dashboardTrendingIssues.findUnique({
      where: { postId },
      select: {
        postId: true,
        postLink: true,
        isCommentsCrawled: true,
        commentsAiSummary: true,
        negativeCommentsRatio: true,
        urgencyLevel: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Bài viết với ID "${postId}" không tồn tại.`);
    }

    const page = Number(dto.page) || 1;
    const limit = Number(dto.limit) || 15;

    // Fetch all comments for this post to accurately construct the hierarchical conversation tree
    const allComments = await this.prisma.dashboardPostComments.findMany({
      where: { postId },
      orderBy: { commentedAt: 'asc' },
    });

    // Compute sentiment statistics across all comments of the post
    const counts: Record<string, number> = {
      'Tiêu cực': 0,
      'Bức xúc': 0,
      'Stress lo âu': 0,
      'Trung lập': 0,
      'Tích cực': 0,
    };

    allComments.forEach((c) => {
      counts[c.sentimentLabel] = (counts[c.sentimentLabel] || 0) + 1;
    });

    const negative = counts['Tiêu cực'] || 0;
    const stressAnxiety =
      (counts['Stress lo âu'] || 0) + (counts['Bức xúc'] || 0);
    const neutral = counts['Trung lập'] || 0;
    const positive = counts['Tích cực'] || 0;
    const totalEvaluated = negative + stressAnxiety + neutral + positive;
    const negativeRatio =
      totalEvaluated > 0
        ? Math.round(((negative + stressAnxiety) / totalEvaluated) * 10000) /
          100
        : 0;

    // Construct the parent-child nested comment tree
    type CommentNode = (typeof allComments)[0] & {
      replyToAuthor?: string | null;
      replies: CommentNode[];
    };

    const commentMap = new Map<string, CommentNode>();
    allComments.forEach((c) => {
      commentMap.set(c.commentId, {
        ...c,
        replyToAuthor: null,
        replies: [],
      });
    });

    const roots: CommentNode[] = [];
    allComments.forEach((c) => {
      const node = commentMap.get(c.commentId)!;
      if (c.parentCommentId && commentMap.has(c.parentCommentId)) {
        const parent = commentMap.get(c.parentCommentId)!;
        node.replyToAuthor = parent.author;
        parent.replies.push(node);
      } else {
        roots.push(node);
      }
    });

    // Filtering logic: include root if root matches OR any nested reply matches
    const matchesCriteria = (node: CommentNode): boolean => {
      let match = true;
      if (dto.sentimentLabel && node.sentimentLabel !== dto.sentimentLabel) {
        match = false;
      }
      if (
        dto.isTopConcern !== undefined &&
        node.isTopConcern !== dto.isTopConcern
      ) {
        match = false;
      }
      return match;
    };

    const hasMatchingDescendant = (node: CommentNode): boolean => {
      if (matchesCriteria(node)) return true;
      return node.replies.some((child) => hasMatchingDescendant(child));
    };

    const filteredRoots =
      dto.sentimentLabel || dto.isTopConcern !== undefined
        ? roots.filter(hasMatchingDescendant)
        : roots;

    // Sorting logic for root threads
    if (dto.sortBy === 'date') {
      filteredRoots.sort(
        (a, b) =>
          new Date(b.commentedAt).getTime() - new Date(a.commentedAt).getTime(),
      );
    } else {
      // Default: sort by reaction count descending
      filteredRoots.sort(
        (a, b) =>
          b.reactionCount - a.reactionCount ||
          new Date(b.commentedAt).getTime() - new Date(a.commentedAt).getTime(),
      );
    }

    // Pagination for root threads
    const totalRoots = filteredRoots.length;
    const totalPages = Math.ceil(totalRoots / limit) || 1;
    const paginatedRoots = filteredRoots.slice(
      (page - 1) * limit,
      page * limit,
    );

    return {
      postId,
      postInfo: {
        postLink: post.postLink,
        isCommentsCrawled: post.isCommentsCrawled,
        commentsAiSummary: post.commentsAiSummary,
        negativeCommentsRatio: post.negativeCommentsRatio,
        urgencyLevel: post.urgencyLevel,
      },
      totalComments: allComments.length,
      filteredComments: totalRoots,
      sentimentStats: {
        negative,
        stressAnxiety,
        neutral,
        positive,
        negativeRatio,
      },
      comments: paginatedRoots,
      pagination: {
        page,
        limit,
        totalPages,
        totalRecords: totalRoots,
      },
    };
  }

  /**
   * On-demand trigger to crawl comments for a specific post via GitHub Action.
   */
  async triggerCrawlPostComments(postId: string, actor: ActiveUserData) {
    const post = await this.prisma.dashboardTrendingIssues.findUnique({
      where: { postId },
      select: {
        postId: true,
        postLink: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Bài viết với ID "${postId}" không tồn tại.`);
    }

    const owner =
      this.configService.get<string>('GITHUB_REPO_OWNER') || 'zzVu77';
    const repo =
      this.configService.get<string>('GITHUB_REPO_NAME') ||
      'uni-feedback-portal';
    const workflowId =
      this.configService.get<string>('GITHUB_WORKFLOW_ID') ||
      'daily-pipeline.yml';
    const ref = this.configService.get<string>('GITHUB_REF') || 'main';

    let triggerResult: any = null;
    try {
      triggerResult = await this.githubActionService.triggerWorkflow({
        owner,
        repo,
        workflowId,
        ref,
        inputs: {
          target_post_id: postId,
          target_post_url: post.postLink || '',
        },
      });
    } catch (error: any) {
      return {
        success: false,
        message: `Không thể kích hoạt GitHub Action: ${error?.message || 'Lỗi không xác định'}`,
        postId,
        postLink: post.postLink,
        actor: { id: actor?.sub, role: actor?.role },
      };
    }

    return {
      success: true,
      message: `Đã gửi yêu cầu cào bình luận cho bài viết thành công. Tiến trình pipeline đang được khởi chạy.`,
      postId,
      postLink: post.postLink,
      actor: { id: actor?.sub, role: actor?.role },
      details: triggerResult,
    };
  }
}
