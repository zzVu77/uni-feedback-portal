import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CommentDeletedResponseDto,
  CommentDto,
  CommentsResponseDto,
  CreateCommentReportDto,
  QueryCommentsDto,
  CreateCommentDto,
} from './dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CommentReports,
  CommentTargetType,
  ReportStatus,
} from '@prisma/client';
@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async CreateForumPostComment(
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

    if (dto.parentId) {
      const parentComment = await this.prisma.comments.findUnique({
        where: { id: dto.parentId },
        select: { parentId: true },
      });

      if (!parentComment) {
        throw new NotFoundException(`Parent comment not found`);
      }

      if (parentComment.parentId) {
        throw new BadRequestException(`You cannot reply to a reply comment.`);
      }
    }
    const comment = await this.prisma.comments.create({
      data: {
        targetId: postId,
        userId,
        content: dto.content,
        targetType: CommentTargetType.FORUM_POST,
        parentId: dto.parentId ?? null,
      },
      include: {
        user: true,
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      parentId: comment.parentId,
      createdAt: comment.createdAt.toISOString(),
      user: {
        id: comment.user.id,
        fullName: comment.user.fullName,
        role: comment.user.role,
      },
    };
  }
  async GetForumPostComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [rootComments, total] = await Promise.all([
      this.prisma.comments.findMany({
        where: {
          targetId: postId,
          targetType: CommentTargetType.FORUM_POST,
          deletedAt: null,
          parentId: null,
        },
        include: {
          user: true,
          replies: {
            where: { deletedAt: null },
            include: {
              user: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.comments.count({
        where: {
          targetId: postId,
          targetType: CommentTargetType.FORUM_POST,
          deletedAt: null,
        },
      }),
    ]);

    const results = rootComments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: {
        id: comment.user.id,
        fullName: comment.user.fullName,
        role: comment.user.role,
      },
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        user: {
          id: reply.user.id,
          fullName: reply.user.fullName,
          role: reply.user.role,
        },
      })),
    }));

    return {
      results,
      total,
    };
  }

  async CreateCommentReport(
    commentId: string,
    userId: string,
    dto: CreateCommentReportDto,
  ): Promise<CommentReports> {
    const comment = await this.prisma.comments.findFirst({
      where: { id: commentId, deletedAt: null },
      select: {
        id: true,
        content: true,
        createdAt: true,
        deletedAt: true,
        targetType: true,
        targetId: true,
        user: { select: { id: true, fullName: true } },
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    const existing = await this.prisma.commentReports.findFirst({
      where: { commentId, userId },
    });
    if (existing) {
      throw new BadRequestException('You have already reported this comment.');
    }

    const report = await this.prisma.commentReports.create({
      data: {
        commentId,
        userId,
        reason: dto.reason,
        status: ReportStatus.PENDING,
      },
      include: {
        user: { select: { id: true, fullName: true } },
      },
    });
    return report;
  }

  async DeleteComment(
    commentId: string,
    actor: {
      id: string;
      role: 'ADMIN' | 'STUDENT';
    },
  ): Promise<CommentDeletedResponseDto> {
    const comment = await this.prisma.comments.findUnique({
      where: { id: commentId },
      include: {
        user: { select: { id: true, fullName: true } },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (actor.role == 'STUDENT' && comment.user.id !== actor.id) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }

    const now = new Date();

    const updatedComment = await this.prisma.comments.update({
      where: { id: commentId },
      data: { deletedAt: now },
      include: {
        user: { select: { id: true, fullName: true } },
      },
    });

    await this.prisma.comments.updateMany({
      where: { parentId: commentId },
      data: { deletedAt: now },
    });

    const mappedComment: CommentDeletedResponseDto = {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt.toISOString(),
      deletedAt: (updatedComment.deletedAt as Date).toISOString(),
      user: {
        id: updatedComment.user.id,
        fullName: updatedComment.user.fullName,
      },
    };

    return mappedComment;
  }
  async countCommentsForPosts(
    postIds: string[],
  ): Promise<Record<string, number>> {
    const commentCounts = await this.prisma.comments.groupBy({
      by: ['targetId'],
      where: {
        targetType: CommentTargetType.FORUM_POST,
        targetId: { in: postIds },
        deletedAt: null,
      },
      _count: { _all: true },
    });

    return commentCounts.reduce(
      (acc, c) => {
        acc[c.targetId] = c._count._all;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
