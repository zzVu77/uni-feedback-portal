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
import { CommentTargetType, Prisma } from '@prisma/client';
import { CommentService } from '../comment/comment.service';
import { ForumService } from '../forum/forum.service';
import { AnnouncementsService } from '../announcements/announcements.service';
import { GenerateAdminResponse } from 'src/shared/helpers/comment_report-message.helper';
@Injectable()
export class ModerationService {
  constructor(
    private prisma: PrismaService,
    private commentService: CommentService,
    private readonly forumService: ForumService,
    private readonly announcementService: AnnouncementsService,
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
              targetId: true,
              targetType: true,
              user: { select: { id: true, fullName: true } },
            },
          },
          user: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.commentReports.count({ where }),
    ]);

    const postIds = items
      .filter((i) => i.comment.targetType === CommentTargetType.FORUM_POST)
      .map((i) => i.comment.targetId);

    const announcementIds = items
      .filter((i) => i.comment.targetType === CommentTargetType.ANNOUNCEMENT)
      .map((i) => i.comment.targetId);

    const [postMap, announcementMap] = await Promise.all([
      this.forumService.getManyByIds(postIds),
      this.announcementService.getManyByIds(announcementIds),
    ]);

    const results = items.map((item) => {
      const comment = item.comment;
      const targetType = comment.targetType;

      const targetInfo =
        targetType === CommentTargetType.FORUM_POST
          ? postMap[comment.targetId]
          : announcementMap[comment.targetId];

      return {
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
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
          deletedAt: comment.deletedAt?.toISOString() ?? null,
          user: {
            id: comment.user.id,
            fullName: comment.user.fullName,
          },
        },

        target: {
          targetType,
          targetInfo: {
            id: targetInfo?.id ?? comment.targetId,
            title: targetInfo?.title ?? '(Deleted)',
            content: targetInfo?.content ?? '(No content available)',
          },
        },
      };
    });

    return {
      results,
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

    // === 1. Lấy report chi tiết + quan hệ comment, user ===
    const report = await this.prisma.commentReports.findUnique({
      where: { id: commentReportId },
      include: {
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            deletedAt: true,
            targetId: true,
            targetType: true,
            user: { select: { id: true, fullName: true } },
          },
        },
        user: { select: { id: true, fullName: true } },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report not found`);
    }

    // === 2. Lấy targetInfo từ service tương ứng ===
    const { targetId, targetType } = report.comment;
    const targetInfo = await this.getTargetInfo(targetId, targetType);

    // === 3. Map dữ liệu sang DTO ===
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
      },

      target: {
        targetType,
        targetInfo: {
          id: targetInfo?.id ?? targetId,
          title: targetInfo?.title ?? '(Deleted)',
          content: targetInfo?.content ?? '(No content available)',
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
    const isDeleting = dto.isDeleted === true;

    if (isDeleting && report.comment) {
      await this.commentService.DeleteComment(report.comment.id, actor);
    }

    const adminResponse = GenerateAdminResponse(dto.status, isDeleting);
    const updatedReport = await this.prisma.commentReports.update({
      where: { id },
      data: {
        status: dto.status ?? report.status,
        adminResponse: adminResponse,
      },
      include: {
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            deletedAt: true,
            user: { select: { id: true, fullName: true } },
            targetId: true,
            targetType: true,
          },
        },
        user: { select: { id: true, fullName: true } },
      },
    });
    await this.prisma.commentReports.updateMany({
      where: { commentId: report.comment.id, id: { not: id } },
      data: {
        status: dto.status,
        adminResponse: adminResponse,
      },
    });
    const { targetId, targetType } = updatedReport.comment;
    const targetInfo = await this.getTargetInfo(targetId, targetType);

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
      },
      target: {
        targetType,
        targetInfo: {
          id: targetInfo?.id ?? targetId,
          title: targetInfo?.title ?? '(Deleted)',
          content: targetInfo?.content ?? '(No content available)',
        },
      },
    };

    return mappedReport;
  }
  private async getTargetInfo(targetId: string, targetType: CommentTargetType) {
    if (targetType === CommentTargetType.FORUM_POST) {
      const map = await this.forumService.getManyByIds([targetId]);
      return map[targetId] ?? null;
    }
    if (targetType === CommentTargetType.ANNOUNCEMENT) {
      const map = await this.announcementService.getManyByIds([targetId]);
      return map[targetId] ?? null;
    }
    return null;
  }
}
