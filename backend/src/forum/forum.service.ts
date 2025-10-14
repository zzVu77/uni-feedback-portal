import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostsResponseDto, QueryPostsDto, GetPostResponseDto } from './dto';
@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) {}

  async getListPosts(query: QueryPostsDto): Promise<GetPostsResponseDto> {
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
            },
          },
          _count: { select: { comments: true, votes: true } },
          createdAt: true,
        },
      }),
      this.prisma.forumPosts.count({ where }),
    ]);
    const mappedItems = items.map((post) => ({
      postId: post.postId,
      feedbackId: post.feedbackId,
      createdAt: post.createdAt,
      votes: post._count.votes,
      subject: post.feedback.subject,
      excerpt: post.feedback.description.slice(0, 100),
      categoryId: post.feedback.categoryId,
      departmentId: post.feedback.departmentId,
      commentsCount: post._count.comments,
    }));

    return { results: mappedItems, total };
  }
  // create(createForumDto: CreateForumDto) {
  //   return 'This action adds a new forum';
  // }
  // findAll() {
  //   return `This action returns all forum`;
  // }
  async getPostDetail(
    postId: number,
    actorId: number,
  ): Promise<GetPostResponseDto> {
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
      },
      votes: post.votes.length,
      hasVoted: post.votes.some((vote) => vote.userId === actorId),
    };
  }

  // update(id: number, updateForumDto: UpdateForumDto) {
  //   return `This action updates a #${id} forum`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} forum`;
  // }
  // async listComments(post_id: number, query: QueryCommentsDto) {
  //   const { page = 1, pageSize = 10 } = query;
  //   const skip = (page - 1) * pageSize;
  //   const take = pageSize;

  //   const comments = await this.prisma.comments.findMany({
  //     where: { post_id },
  //     skip,
  //     take,
  //     orderBy: { created_at: 'desc' },
  //     select: {
  //       comment_id: true,
  //       content: true,
  //       created_at: true,
  //       user: {
  //         select: {
  //           user_id: true,
  //           full_name: true,
  //           role: true,
  //         },
  //       },
  //     },
  //   });

  //   return comments.map((c) => ({
  //     comment_id: c.comment_id,
  //     content: c.content,
  //     created_at: c.created_at.toISOString(),
  //     user: {
  //       user_id: c.user.user_id,
  //       full_name: c.user.full_name,
  //       role: c.user.role,
  //     },
  //   }));
  // }
}
