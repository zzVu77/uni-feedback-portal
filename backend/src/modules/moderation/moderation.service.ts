import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  QueryCommentReportsDto,
  CommentReportResponseDto,
  CommentReportDto,
  UpdateCommentReportDto,
} from './dto';
import { Prisma } from '@prisma/client';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class ModerationService {
  constructor(
    private prisma: PrismaService,
    private commentService: CommentService,
  ) {}
  async GetReports(
    query: QueryCommentReportsDto,
    actor: { role: 'ADMIN'; id: string },
  ): Promise<CommentReportResponseDto> {
    if (actor.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }
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
          post: {
            id: item.comment.post?.id,
            subject: item.comment.post.feedback?.subject,
            description: item.comment.post.feedback?.description,
          },
        },
      })),
      total,
    };
  }
  async GetReportDetail(
    commentReportId: string,
    actor: { role: 'ADMIN'; id: string },
  ): Promise<CommentReportDto> {
    if (actor.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied: Admin privileges required.');
    }

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
  async UpdateReport(
    id: string,
    dto: UpdateCommentReportDto,
    actor: { role: 'ADMIN'; id: string },
  ): Promise<CommentReportDto> {
    if (actor.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }
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
      await this.commentService.DeleteComment(report.comment.id, actor);
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
}
