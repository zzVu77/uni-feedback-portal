import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostsResponseDto, QueryPostsDto, PostResponseDto } from './dto';
@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) {}

  async getListPosts(
    query: QueryPostsDto,
    userId: number,
  ): Promise<GetPostsResponseDto> {
    const {
      page = 1,
      pageSize = 10,
      category_id,
      department_id,
      sortBy,
      q,
    } = query;

    // pagination
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    // WHERE condition
    const where: Prisma.ForumPostsWhereInput = {};

    if (category_id || department_id || q) {
      where.feedback = {};

      if (category_id) {
        where.feedback.categoryId = category_id;
      }
      if (department_id) {
        where.feedback.departmentId = department_id; // filter by departmentId
      }
      if (q) {
        // search by subject
        where.feedback.subject = { contains: q, mode: 'insensitive' };
      }
    }
    // ORDER BY
    let orderBy: Prisma.ForumPostsOrderByWithRelationInput = {
      createdAt: 'desc',
    }; // default sort: new
    if (sortBy === 'top') {
      orderBy = {
        votes: {
          _count: 'desc',
        },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.forumPosts.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          postId: true,
          feedbackId: true,
          feedback: {
            select: {
              subject: true,
              description: true,
              categoryId: true,
              departmentId: true,
              currentStatus: true,
            },
          },
          votes: {
            select: { userId: true }, // to check if actorId has voted
          },
          _count: { select: { comments: true, votes: true } },
          createdAt: true,
        },
      }),
      this.prisma.forumPosts.count({ where }),
    ]);
    const mappedItems = items.map((post) => ({
      postId: post.postId,
      createdAt: post.createdAt,
      votes: post._count.votes,
      subject: post.feedback.subject,
      excerpt: post.feedback.description.slice(0, 100),
      categoryId: post.feedback.categoryId,
      departmentId: post.feedback.departmentId,
      currentStatus: post.feedback.currentStatus,
      commentsCount: post._count.comments,
      hasVoted: post.votes.some((vote) => vote.userId === userId),
    }));

    return { results: mappedItems, total };
  }

  async getPostDetail(
    postId: number,
    actorId: number,
  ): Promise<PostResponseDto> {
    // Fetch the post with relations
    const post = await this.prisma.forumPosts.findUnique({
      where: { postId },
      select: {
        postId: true,
        createdAt: true,
        feedback: {
          select: {
            feedbackId: true,
            subject: true,
            description: true,
            categoryId: true,
            departmentId: true,
            currentStatus: true,
          },
        },
        votes: {
          select: { userId: true }, // to check if actorId has voted
        },
      },
    });

    if (!post) {
      throw new Error(`Post with id ${postId} not found`);
    }

    return {
      postId: post.postId,
      createdAt: post.createdAt.toISOString(),
      feedback: {
        feedbackId: post.feedback.feedbackId,
        subject: post.feedback.subject,
        description: post.feedback.description,
        categoryId: post.feedback.categoryId,
        departmentId: post.feedback.departmentId,
        currentStatus: post.feedback.currentStatus,
      },
      votes: post.votes.length,
      hasVoted: post.votes.some((vote) => vote.userId === actorId),
    };
  }
}
