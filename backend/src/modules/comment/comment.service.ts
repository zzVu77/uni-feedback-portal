/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
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
import { report } from 'process';
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
  async createReport(
    commentId: string,
    userId: string,
    dto: CreateCommentReportDto,
  ): Promise<CommentReportDto> {
    // Kiểm tra comment tồn tại
    const comment = await this.prisma.comments.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Tạo report
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
                  select: { id: true, subject: true, description: true },
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
              user: { select: { id: true, fullName: true } },
              post: {
                select: {
                  id: true,
                  feedback: {
                    select: { id: true, subject: true, description: true },
                  },
                },
              },
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
          user: {
            id: item.comment.user.id,
            fullName: item.comment.user.fullName,
          },
        },
      })),
      total,
    };
  }
  async getReportDetail(
    commentReportId: string,
  ): Promise<CommentReportDto | null> {
    const report = await this.prisma.commentReports.findUnique({
      where: { id: commentReportId },
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
                  select: { id: true, subject: true, description: true },
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
        user: {
          id: report.comment.user.id,
          fullName: report.comment.user.fullName,
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
    });

    if (!report) {
      throw new NotFoundException('Report not found');
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
            user: { select: { id: true, fullName: true } },
            post: {
              select: {
                id: true,
                feedback: {
                  select: { id: true, subject: true, description: true },
                },
              },
            },
          },
        },
        user: { select: { id: true, fullName: true } },
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
        user: {
          id: updatedReport.comment.user.id,
          fullName: updatedReport.comment.user.fullName,
        },
      },
    };

    return mappedReport;
  }
}
