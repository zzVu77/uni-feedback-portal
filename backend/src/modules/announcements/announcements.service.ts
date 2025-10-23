import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  AnnouncementDetailDto,
  AnnouncementListResponseDto,
  CreateAnnouncementDto,
  QueryAnnouncementsDto,
  UpdateAnnouncementDto,
} from './dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}
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
      if (to) where.createdAt.lte = new Date(to);
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
            fullName: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        files: true,
      },
    });
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }

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
      files: announcement.files.map((f) => ({
        id: f.id,
        fileName: f.fileName,
        fileUrl: f.fileUrl,
      })),
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
        files: dto.files
          ? {
              create: dto.files.map((file) => ({
                fileName: file.fileName,
                fileUrl: file.fileUrl,
              })),
            }
          : undefined,
      },
      include: {
        user: {
          include: {
            department: true,
          },
        },
        files: true,
      },
    });

    return {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      createdAt: announcement.createdAt,
      user: {
        id: announcement.user.id,
        userName: announcement.user.fullName,
      },
      department: {
        id: announcement.user.department.id,
        name: announcement.user.department.name,
      },
      files: announcement.files.map((f) => ({
        fileName: f.fileName,
        fileUrl: f.fileUrl,
      })),
    };
  }
  async updateAnnouncement(
    id: string,
    dto: UpdateAnnouncementDto,
    userId: string,
  ): Promise<AnnouncementDetailDto> {
    const existing = await this.prisma.announcements.findUnique({
      where: { id, userId },
      include: { files: true },
    });

    if (!existing) throw new NotFoundException('Announcement not found');

    const existingFiles =
      await this.prisma.fileAttachmentForAnnouncement.findMany({
        where: { announcementId: id },
      });

    // get list of new file URLs from dto
    const newFileUrls = dto.files?.map((f) => f.fileUrl) ?? [];

    // Identify files to delete
    const filesToDelete = existingFiles.filter(
      (f) => !newFileUrls.includes(f.fileUrl),
    );

    // Identify files to add
    const filesToAdd =
      dto.files?.filter(
        (f) => !existingFiles.some((e) => e.fileUrl === f.fileUrl),
      ) ?? [];

    // Delete file if exist
    if (filesToDelete.length > 0) {
      await this.prisma.fileAttachmentForAnnouncement.deleteMany({
        where: { id: { in: filesToDelete.map((f) => f.id) } },
      });
    }
    // Add new file (if any)
    if (filesToAdd.length > 0) {
      await this.prisma.fileAttachmentForAnnouncement.createMany({
        data: filesToAdd.map((f) => ({
          announcementId: id,
          fileName: f.fileName,
          fileUrl: f.fileUrl,
        })),
      });
    }
    // console.log('Files to delete:', filesToDelete);
    // console.log('Files to add:', filesToAdd);
    // console.log('existingFiles:', existingFiles);
    const updated = await this.prisma.announcements.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
      },
      include: {
        files: true,
        user: { select: { id: true, fullName: true, department: true } },
      },
    });

    const mapped: AnnouncementDetailDto = {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      createdAt: updated.createdAt,

      user: {
        id: updated.user.id,
        userName: updated.user.fullName,
      },

      department: {
        id: updated.user.department.id,
        name: updated.user.department.name,
      },

      files: updated.files.map((f) => ({
        id: f.id,
        fileUrl: f.fileUrl,
        fileName: f.fileName,
      })),
    };

    return mapped;
  }

  async deleteAnnouncement(
    id: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    const existing = await this.prisma.announcements.findUnique({
      where: { id, userId },
    });

    if (!existing) throw new NotFoundException('Announcement not found');

    await this.prisma.announcements.delete({
      where: { id },
    });

    return { success: true };
  }
}
