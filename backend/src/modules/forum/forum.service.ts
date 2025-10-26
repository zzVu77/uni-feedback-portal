import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { GetPostsResponseDto, QueryPostsDto, PostDetailDto } from './dto';
@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) {}

  async getListPosts(
    query: QueryPostsDto,
    userId: string,
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

    // pagination
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    // WHERE condition
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
            select: { userId: true }, // to check if actorId has voted
          },
          _count: { select: { comments: true, votes: true } },
        },
      }),
      this.prisma.forumPosts.count({ where: whereClause }),
    ]);
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
            student: {
              id: post.feedback.user.id,
              fullName: post.feedback.user.fullName,
              email: post.feedback.user.email,
            },
          }),
      commentsCount: post._count.comments,
      hasVoted: post.votes.some((vote) => vote.userId === userId),
    }));

    return { results: mappedItems, total };
  }

  async getPostDetail(postId: string, userId: string): Promise<PostDetailDto> {
    // Fetch the post with relations
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
          select: { userId: true }, // to check if actorId has voted
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    // 🔹 MOCK COMMENT DATA
    const mockComments = [
      {
        id: 'cmt-1',
        content: 'Totally agree with this feedback!',
        createdAt: new Date('2025-10-21T09:00:00Z').toISOString(),
        user: {
          id: 'user-1',
          fullName: 'Nguyen Van A',
          email: 'a@student.edu.vn',
          role: 'STUDENT',
        },
      },
      {
        id: 'cmt-2',
        content: 'We are currently working on fixing this issue.',
        createdAt: new Date('2025-10-21T10:15:00Z').toISOString(),
        user: {
          id: 'user-2',
          fullName: 'Tran Thi B',
          email: 'b@dept.edu.vn',
          role: 'DEPARTMENT_STAFF',
        },
      },
      {
        id: 'cmt-3',
        content: 'Issue resolved in the latest update.',
        createdAt: new Date('2025-10-22T08:45:00Z').toISOString(),
        user: {
          id: 'user-3',
          fullName: 'Admin C',
          email: 'admin@school.edu.vn',
          role: 'ADMIN',
        },
      },
    ];
    return {
      id: post.id,
      createdAt: post.createdAt.toISOString(),
      votes: post.votes.length,
      hasVoted: post.votes.some((vote) => vote.userId === userId),
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
      },
      ...(post.feedback.isPrivate
        ? {}
        : {
            student: {
              id: post.feedback.user.id,
              fullName: post.feedback.user.fullName,
              email: post.feedback.user.email,
            },
          }),
      comments: {
        results: mockComments,
        total: mockComments.length,
      },
    };
  }
}
