import { Injectable, NotFoundException } from '@nestjs/common';
import { FileTargetType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  AnnouncementDetailDto,
  AnnouncementListResponseDto,
  CreateAnnouncementDto,
  QueryAnnouncementsDto,
  UpdateAnnouncementDto,
} from './dto';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class AnnouncementsService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}
  async getAnnouncements(
    query: QueryAnnouncementsDto,
  ): Promise<AnnouncementListResponseDto> {
    const {
      page = 1,
      pageSize = 10,
      departmentId,
      userId,
      q,
      from,
      to,
    } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Build dynamic WHERE condition
    const where: Prisma.AnnouncementsWhereInput = {};

    if (departmentId) {
      where.user = { departmentId: departmentId };
    }

    if (userId) {
      where.userId = userId;
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to)
        where.createdAt.lt = new Date(
          new Date(to).setDate(new Date(to).getDate() + 1),
        );
    }

    // Query data + total count
    const [items, total] = await Promise.all([
      this.prisma.announcements.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              department: {
                select: { id: true, name: true },
              },
            },
          },
        },
      }),
      this.prisma.announcements.count({ where }),
    ]);

    // Map to DTO
    const mappedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      createdAt: item.createdAt,
      user: {
        id: item.user.id,
        userName: item.user.fullName,
      },
      department: {
        id: item.user.department.id,
        name: item.user.department.name,
      },
    }));

    return { results: mappedItems, total };
  }

  async getAnnouncementDetail(id: string): Promise<AnnouncementDetailDto> {
    const announcement = await this.prisma.announcements.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true, // Thêm id của user
            fullName: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        // Không include files ở đây nữa
      },
    });
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }

    // Lấy file đính kèm bằng UploadsService
    const files = await this.uploadsService.getAttachmentsForTarget(
      id,
      FileTargetType.ANNOUNCEMENT,
    );

    return {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      createdAt: announcement.createdAt,
      user: {
        id: announcement.userId,
        userName: announcement.user.fullName,
      },
      department: {
        id: announcement.user.department.id,
        name: announcement.user.department.name,
      },
      files: files, // Trả về đúng cấu trúc DTO mới
    };
  }
  async createAnnouncement(
    dto: CreateAnnouncementDto,
    userId: string,
  ): Promise<AnnouncementDetailDto> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const announcement = await this.prisma.announcements.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId: user.id,
      },
    });

    // Gọi service chuyên dụng để xử lý file
    if (dto.files && dto.files.length > 0) {
      await this.uploadsService.updateAttachmentsForTarget(
        announcement.id,
        FileTargetType.ANNOUNCEMENT,
        dto.files,
      );
    }

    // Lấy lại thông tin chi tiết để trả về
    return this.getAnnouncementDetail(announcement.id);
  }
  async updateAnnouncement(
    id: string,
    dto: UpdateAnnouncementDto,
    userId: string,
  ): Promise<AnnouncementDetailDto> {
    const announcement = await this.prisma.announcements.findUnique({
      where: { id, userId },
    });

    if (!announcement) throw new NotFoundException('Announcement not found');

    // 1. Cập nhật thông tin announcement
    await this.prisma.announcements.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
      },
    });

    // 2. Cập nhật file đính kèm bằng service chuyên dụng
    await this.uploadsService.updateAttachmentsForTarget(
      id,
      FileTargetType.ANNOUNCEMENT,
      dto.files ?? [],
    );

    return this.getAnnouncementDetail(id);
  }

  async deleteAnnouncement(
    id: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    const existing = await this.prisma.announcements.findUnique({
      where: { id, userId },
    });

    if (!existing) throw new NotFoundException('Announcement not found');

    // Xóa file đính kèm trong DB (và trên S3 trong tương lai) bằng service
    await this.uploadsService.deleteAttachmentsForTarget(
      id,
      FileTargetType.ANNOUNCEMENT,
    );

    // Xóa announcement
    await this.prisma.announcements.delete({
      where: { id },
    });

    return { success: true };
  }
  async getManyByIds(
    ids: string[],
  ): Promise<Record<string, { id: string; title: string; content: string }>> {
    if (!ids || ids.length === 0) return {};

    const posts = await this.prisma.announcements.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        content: true,
        title: true,
      },
    });
    return Object.fromEntries(
      posts.map((p) => [
        p.id,
        {
          id: p.id,
          title: p.title ?? '(Deleted)',
          content: p.content ?? '(No content available)',
        },
      ]),
    );
  }
}
