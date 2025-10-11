import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostResponseDto } from './dto/get-post-param-response.dto';
import { QueryCommentsDto } from './dto/query-comments.dto';
import { QueryPostsDto } from './dto/query-posts.dto';

@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) {}

  async listPosts(query: QueryPostsDto) {
    // destructure query params, if not provided, use default values
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
    // Set up where condition
    const where: Prisma.forum_postsWhereInput = {}; // start with empty condition

    // add conditions based on provided filters
    if (category_id || department_id || q) {
      where.feedback = {}; // init object

      if (category_id) {
        where.feedback.category_id = category_id; // filter by category_id
      }
      if (department_id) {
        where.feedback.department_id = department_id; // filter by department_id
      }
      if (q) {
        // search by subject
        where.feedback.subject = { contains: q, mode: 'insensitive' };
      }
    }

    // ORDER BY
    let orderBy: Prisma.forum_postsOrderByWithRelationInput = {
      created_at: 'desc',
    }; // default sort: new
    if (sortBy === 'top') {
      orderBy = {
        votes: {
          _count: 'desc',
        },
      };
    }

    // Fetch posts with pagination and filters
    const [items, total] = await Promise.all([
      this.prisma.forum_posts.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          post_id: true,
          feedback_id: true,
          feedback: {
            select: {
              subject: true,
              description: true,
              category_id: true,
              department_id: true,
            },
          },
          _count: { select: { comments: true, votes: true } },
          created_at: true,
        },
      }),
      this.prisma.forum_posts.count({ where }),
    ]);
    const result = items.map((post) => ({
      post_id: post.post_id,
      feedback_id: post.feedback_id,
      created_at: post.created_at,
      votes: post._count.votes,
      subject: post.feedback.subject,
      excerpt: post.feedback.description.slice(0, 100), // ví dụ cắt description làm excerpt
      category_id: post.feedback.category_id,
      department_id: post.feedback.department_id,
      comments_count: post._count.comments,
    }));

    return { result, total };
  }

  async getPost(post_id: number, actorId: number): Promise<GetPostResponseDto> {
    // Fetch the post with relations
    const post = await this.prisma.forum_posts.findUnique({
      where: { post_id },
      select: {
        post_id: true,
        created_at: true,
        feedback: {
          select: {
            feedback_id: true,
            subject: true,
            description: true,
            category_id: true,
            department_id: true,
          },
        },
        votes: {
          select: { user_id: true }, // to check if actorId has voted
        },
      },
    });

    if (!post) {
      throw new Error(`Post with id ${post_id} not found`);
    }

    return {
      post_id: post.post_id,
      created_at: post.created_at.toISOString(),
      feedback: {
        feedback_id: post.feedback.feedback_id,
        subject: post.feedback.subject,
        description: post.feedback.description,
        category_id: post.feedback.category_id,
        department_id: post.feedback.department_id,
      },
      votes: post.votes.length,
      hasVoted: post.votes.some((vote) => vote.user_id === actorId),
    };
  }

  async listComments(post_id: number, query: QueryCommentsDto) {
    const { page = 1, pageSize = 10 } = query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const comments = await this.prisma.comments.findMany({
      where: { post_id },
      skip,
      take,
      orderBy: { created_at: 'desc' },
      select: {
        comment_id: true,
        content: true,
        created_at: true,
        user: {
          select: {
            user_id: true,
            full_name: true,
            role: true,
          },
        },
      },
    });

    return comments.map((c) => ({
      comment_id: c.comment_id,
      content: c.content,
      created_at: c.created_at.toISOString(),
      user: {
        user_id: c.user.user_id,
        full_name: c.user.full_name,
        role: c.user.role,
      },
    }));
  }
}
