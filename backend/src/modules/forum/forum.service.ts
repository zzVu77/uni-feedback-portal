import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  GetPostsResponseDto,
  QueryPostsDto,
  PostDetailDto,
  VoteResponseDto,
} from './dto';
import { CommentService } from '../comment/comment.service';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
@Injectable()
export class ForumService {
  constructor(
    private readonly prisma: PrismaService,
    private commentService: CommentService,
  ) {}
  async getListPosts(
    query: QueryPostsDto,
    actor: ActiveUserData,
  ): Promise<GetPostsResponseDto> {
    const {
      page = 1,
      pageSize = 10,
      categoryId,
      departmentId,
      from,
      to,
      sortBy,
      q,
    } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const whereClause: Prisma.ForumPostsWhereInput = {
      feedback: {
        ...(categoryId && { categoryId }),
        ...(departmentId && { departmentId }),
        ...(q && { subject: { contains: q, mode: 'insensitive' } }),
      },
      ...(from || to
        ? {
            createdAt: {
              ...(from && { gte: new Date(from) }),
              ...(to && {
                lt: new Date(new Date(to).setDate(new Date(to).getDate() + 1)),
              }),
            },
          }
        : {}),
    };

    let orderBy: Prisma.ForumPostsOrderByWithRelationInput = {
      createdAt: 'desc',
    };
    if (sortBy === 'top') {
      orderBy = {
        votes: {
          _count: 'desc',
        },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.forumPosts.findMany({
        where: whereClause,
        skip,
        take,
        orderBy,
        include: {
          feedback: {
            select: {
              id: true,
              subject: true,
              description: true,
              location: true,
              currentStatus: true,
              isPrivate: true,
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          votes: {
            select: { userId: true },
          },
          _count: { select: { votes: true } },
        },
      }),
      this.prisma.forumPosts.count({ where: whereClause }),
    ]);
    const postIds = items.map((p) => p.id);
    const commentCountMap =
      await this.commentService.countCommentsForPosts(postIds);
    const mappedItems = items.map((post) => ({
      id: post.id,
      createdAt: post.createdAt.toISOString(),
      votes: post._count.votes,
      feedback: {
        id: post.feedback.id,
        subject: post.feedback.subject,
        description: post.feedback.description,
        isPrivate: post.feedback.isPrivate,
        location: post.feedback.location,
        category: {
          id: post.feedback.category.id,
          name: post.feedback.category.name,
        },
        department: {
          id: post.feedback.department.id,
          name: post.feedback.department.name,
        },
        currentStatus: post.feedback.currentStatus,
      },
      ...(post.feedback.isPrivate
        ? {}
        : {
            user: {
              id: post.feedback.user.id,
              fullName: post.feedback.user.fullName,
              email: post.feedback.user.email,
            },
          }),
      commentsCount: commentCountMap[post.id] ?? 0,
      hasVoted: post.votes.some((vote) => vote.userId === actor.sub),
    }));

    return { results: mappedItems, total };
  }

  async getPostDetail(
    postId: string,
    actor: ActiveUserData,
  ): Promise<PostDetailDto> {
    const post = await this.prisma.forumPosts.findUnique({
      where: { id: postId },
      include: {
        feedback: {
          select: {
            id: true,
            subject: true,
            description: true,
            location: true,
            currentStatus: true,
            statusHistory: true,
            isPrivate: true,
            fileAttachments: {
              select: {
                id: true,
                fileName: true,
                fileUrl: true,
              },
            },
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        votes: {
          select: { userId: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    const resolvedStatus = post.feedback.statusHistory.find(
      (h) => h.status === 'RESOLVED',
    );
    const officeResponse = resolvedStatus?.note ?? resolvedStatus?.message;

    return {
      id: post.id,
      createdAt: post.createdAt.toISOString(),
      votes: post.votes.length,
      hasVoted: post.votes.some((vote) => vote.userId === actor.sub),
      feedback: {
        id: post.feedback.id,
        subject: post.feedback.subject,
        description: post.feedback.description,
        isPrivate: post.feedback.isPrivate,
        location: post.feedback.location,
        category: {
          id: post.feedback.category.id,
          name: post.feedback.category.name,
        },
        department: {
          id: post.feedback.department.id,
          name: post.feedback.department.name,
        },
        currentStatus: post.feedback.currentStatus,
        fileAttachments: post.feedback.fileAttachments.map((f) => ({
          id: f.id,
          fileName: f.fileName,
          fileUrl: f.fileUrl,
        })),
        officeResponse,
      },
      ...(post.feedback.isPrivate
        ? {}
        : {
            user: {
              id: post.feedback.user.id,
              fullName: post.feedback.user.fullName,
              email: post.feedback.user.email,
            },
          }),
    };
  }
  async vote(postId: string, actor: ActiveUserData): Promise<VoteResponseDto> {
    const post = await this.prisma.forumPosts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingVote = await this.prisma.votes.findUnique({
      where: {
        userId_postId: {
          userId: actor.sub,
          postId: postId,
        },
      },
    });

    if (existingVote) {
      throw new BadRequestException('User already voted this post');
    }

    await this.prisma.votes.create({
      data: {
        userId: actor.sub,
        postId: postId,
      },
    });

    const totalVotes = await this.prisma.votes.count({
      where: { postId: postId },
    });

    return {
      postId: postId,
      isVoted: true,
      totalVotes,
    };
  }
  async createForumPost(
    feedbackId: string,
    actor: ActiveUserData,
  ): Promise<string> {
    // Kiểm tra feedback tồn tại
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, userId: actor.sub },
      include: { forumPost: true },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found`);
    }

    if (feedback.forumPost) {
      throw new BadRequestException(
        'Forum post for this feedback already exists',
      );
    }

    const forumPost = await this.prisma.forumPosts.create({
      data: { feedbackId },
    });

    return forumPost.id;
  }

  async unvote(
    postId: string,
    actor: ActiveUserData,
  ): Promise<VoteResponseDto> {
    const post = await this.prisma.forumPosts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingVote = await this.prisma.votes.findUnique({
      where: {
        userId_postId: {
          userId: actor.sub,
          postId: postId,
        },
      },
    });

    if (!existingVote) {
      throw new BadRequestException('User has not voted this post yet');
    }

    await this.prisma.votes.delete({
      where: {
        userId_postId: {
          userId: actor.sub,
          postId: postId,
        },
      },
    });

    const totalVotes = await this.prisma.votes.count({
      where: { postId: postId },
    });

    return {
      postId: postId,
      isVoted: false,
      totalVotes,
    };
  }
  async deleteByFeedbackId(feedbackId: string): Promise<void> {
    await this.prisma.forumPosts.delete({
      where: { feedbackId },
    });
  }

  async getManyByIds(
    ids: string[],
  ): Promise<Record<string, { id: string; title: string; content: string }>> {
    if (!ids || ids.length === 0) return {};

    const posts = await this.prisma.forumPosts.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        feedback: {
          select: {
            subject: true,
            description: true,
          },
        },
      },
    });

    return Object.fromEntries(
      posts.map((p) => [
        p.id,
        {
          id: p.id,
          title: p.feedback?.subject ?? '(Deleted)',
          content: p.feedback?.description ?? '(No content available)',
        },
      ]),
    );
  }
}
