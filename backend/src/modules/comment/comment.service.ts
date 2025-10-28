/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentDto, CommentsResponseDto, QueryCommentsDto } from './dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async createComment(
    dto: CreateCommentDto,
    postId: string,
    userId: string,
  ): Promise<CommentDto> {
    const post = await this.prisma.forumPosts.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    // Tạo comment mới
    const comment = await this.prisma.comments.create({
      data: {
        postId: postId,
        userId,
        content: dto.content,
      },
      include: {
        user: true, // lấy thông tin người tạo comment
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: {
        id: comment.user.id,
        fullName: comment.user.fullName,
        role: comment.user.role,
      },
    };
  }

  // 📃 Lấy danh sách comment cho 1 post
  async getComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [results, total] = await Promise.all([
      this.prisma.comments.findMany({
        where: { postId },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.comments.count({
        where: { postId },
      }),
    ]);

    return {
      results: results.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        user: {
          id: comment.user.id,
          fullName: comment.user.fullName,
          role: comment.user.role,
        },
      })),
      total,
    };
  }
}
