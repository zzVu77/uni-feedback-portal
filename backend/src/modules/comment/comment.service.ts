/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  CommentDto,
  CommentReportDto,
  CommentReportResponseDto,
  CommentsResponseDto,
  CreateCommentReportDto,
  QueryCommentReportsDto,
  QueryCommentsDto,
  UpdateCommentReportDto,
} from './dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma, ReportStatus } from '@prisma/client';
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
        postId: postId,
        userId,
        content: dto.content,
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
  async getComments(
    postId: string,
    query: QueryCommentsDto,
  ): Promise<CommentsResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [rootComments, total] = await Promise.all([
      this.prisma.comments.findMany({
        where: {
          postId,
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
          postId,
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

  async createReport(
    commentId: string,
    userId: string,
    dto: CreateCommentReportDto,
  ): Promise<CommentReportDto> {
    const comment = await this.prisma.comments.findFirst({
      where: { id: commentId, deletedAt: null },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const existing = await this.prisma.commentReports.findFirst({
      where: { commentId, userId },
    });
    if (existing)
      throw new BadRequestException('You have already reported this comment.');

    const report = await this.prisma.commentReports.create({
      data: {
        commentId,
        userId,
        reason: dto.reason,
        status: ReportStatus.PENDING,
      },
      include: {
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: { select: { id: true, fullName: true } },
            post: {
              select: {
                id: true,
                feedback: {
                  select: { subject: true, description: true },
                },
              },
            },
          },
        },
        user: { select: { id: true, fullName: true } },
      },
    });

    const mappedReport: CommentReportDto = {
      id: report.id,
      reason: report.reason ?? null,
      status: report.status,
      adminResponse: report.adminResponse ?? null,
      createdAt: report.createdAt.toISOString(),

      reportedBy: {
        id: report.user.id,
        fullName: report.user.fullName,
      },

      comment: {
        id: report.comment.id,
        content: report.comment.content,
        createdAt: report.comment.createdAt.toISOString(),
        user: {
          id: report.comment.user.id,
          fullName: report.comment.user.fullName,
        },
        post: {
          id: report.comment.post?.id,
          subject: report.comment.post.feedback?.subject,
          description: report.comment.post.feedback?.description,
        },
      },
    };

    return mappedReport;
  }
  async getReports(
    query: QueryCommentReportsDto,
  ): Promise<CommentReportResponseDto> {
    const { page = 1, pageSize = 10, status } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.CommentReportsWhereInput = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.commentReports.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          comment: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              deletedAt: true,
              user: { select: { id: true, fullName: true } },
            },
          },
          user: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.commentReports.count({ where }),
    ]);

    return {
      results: items.map((item) => ({
        id: item.id,
        reason: item.reason ?? null,
        status: item.status,
        adminResponse: item.adminResponse ?? null,
        createdAt: item.createdAt.toISOString(),
        reportedBy: {
          id: item.user.id,
          fullName: item.user.fullName,
        },

        comment: {
          id: item.comment.id,
          content: item.comment.content,
          createdAt: item.comment.createdAt.toISOString(),
          deletedAt: item.comment.deletedAt?.toISOString() ?? null,
          user: {
            id: item.comment.user.id,
            fullName: item.comment.user.fullName,
          },
        },
      })),
      total,
    };
  }
  async getReportDetail(commentReportId: string): Promise<CommentReportDto> {
    const report = await this.prisma.commentReports.findUnique({
      where: { id: commentReportId },
      include: {
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            deletedAt: true,
            user: { select: { id: true, fullName: true } },
            post: {
              select: {
                id: true,
                feedback: {
                  select: { subject: true, description: true },
                },
              },
            },
          },
        },
        user: { select: { id: true, fullName: true } },
      },
    });
    if (!report) {
      throw new NotFoundException(`Report not found`);
    }
    const mappedReport: CommentReportDto = {
      id: report.id,
      reason: report.reason ?? null,
      status: report.status,
      adminResponse: report.adminResponse ?? null,
      createdAt: report.createdAt.toISOString(),

      reportedBy: {
        id: report.user.id,
        fullName: report.user.fullName,
      },

      comment: {
        id: report.comment.id,
        content: report.comment.content,
        createdAt: report.comment.createdAt.toISOString(),
        deletedAt: report.comment.deletedAt?.toISOString() ?? null,
        user: {
          id: report.comment.user.id,
          fullName: report.comment.user.fullName,
        },
        post: {
          id: report.comment.post?.id,
          subject: report.comment.post.feedback?.subject,
          description: report.comment.post.feedback?.description,
        },
      },
    };

    return mappedReport;
  }
  async updateReport(
    id: string,
    dto: UpdateCommentReportDto,
  ): Promise<CommentReportDto> {
    const report = await this.prisma.commentReports.findUnique({
      where: { id },
      include: {
        comment: true,
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (dto.status === 'RESOLVED' && report.comment) {
      await this.deleteComment(report.comment.id);
    }

    const updatedReport = await this.prisma.commentReports.update({
      where: { id },
      data: {
        status: dto.status ?? report.status,
        adminResponse: dto.adminResponse ?? report.adminResponse,
      },
      include: {
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            deletedAt: true,
            user: { select: { id: true, fullName: true } },
            post: {
              select: {
                id: true,
                feedback: {
                  select: { subject: true, description: true },
                },
              },
            },
          },
        },
        user: { select: { id: true, fullName: true } },
      },
    });
    await this.prisma.commentReports.updateMany({
      where: { commentId: report.comment.id, id: { not: id } },
      data: {
        status: dto.status,
        adminResponse: dto.adminResponse ?? undefined,
      },
    });
    const mappedReport: CommentReportDto = {
      id: updatedReport.id,
      reason: updatedReport.reason ?? null,
      status: updatedReport.status,
      adminResponse: updatedReport.adminResponse ?? null,
      createdAt: updatedReport.createdAt.toISOString(),

      reportedBy: {
        id: updatedReport.user.id,
        fullName: updatedReport.user.fullName,
      },

      comment: {
        id: updatedReport.comment.id,
        content: updatedReport.comment.content,
        createdAt: updatedReport.comment.createdAt.toISOString(),
        deletedAt: updatedReport.comment.deletedAt
          ? updatedReport.comment.deletedAt.toISOString()
          : null,
        user: {
          id: updatedReport.comment.user.id,
          fullName: updatedReport.comment.user.fullName,
        },
        post: {
          id: updatedReport.comment.post?.id,
          subject: updatedReport.comment.post.feedback?.subject,
          description: updatedReport.comment.post.feedback?.description,
        },
      },
    };

    return mappedReport;
  }
  async deleteComment(commentId: string, userId?: string): Promise<CommentDto> {
    const comment = await this.prisma.comments.findUnique({
      where: { id: commentId },
      include: {
        user: { select: { id: true, fullName: true } },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (userId && comment.user.id !== userId) {
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

    const mappedComment: CommentDto = {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt.toISOString(),
      deletedAt: updatedComment.deletedAt
        ? updatedComment.deletedAt.toISOString()
        : null,
      user: {
        id: updatedComment.user.id,
        fullName: updatedComment.user.fullName,
      },
      parentId: updatedComment.parentId,
    };

    return mappedComment;
  }
}
