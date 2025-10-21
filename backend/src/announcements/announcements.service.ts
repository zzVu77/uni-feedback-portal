import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AnnouncementDetailDto,
  AnnouncementListResponseDto,
  QueryAnnouncementsDto,
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
      userId: item.userId,
      userName: item.user.fullName,
      departmentId: item.user.department.id,
      departmentName: item.user.department.name,
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
      userName: announcement.user.fullName,
      departmentId: announcement.user.department.id,
      departmentName: announcement.user.department.name,
      files: announcement.files.map((f) => ({
        id: f.id,
        fileName: f.fileName,
        fileUrl: f.fileUrl,
      })),
    };
  }
}
