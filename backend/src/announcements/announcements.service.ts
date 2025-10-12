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
    const where: Prisma.announcementsWhereInput = {};

    if (departmentId) {
      where.user = { department_id: departmentId };
    }

    if (userId) {
      where.user_id = userId;
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (from || to) {
      where.created_at = {};
      if (from) where.created_at.gte = new Date(from);
      if (to) where.created_at.lte = new Date(to);
    }

    // Query data + total count
    const [items, total] = await Promise.all([
      this.prisma.announcements.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              user_id: true,
              full_name: true,
              department: {
                select: { department_id: true, department_name: true },
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
      createdAt: item.created_at,
      userId: item.user_id,
      userName: item.user.full_name,
      departmentId: item.user.department.department_id,
      departmentName: item.user.department.department_name,
    }));

    return { results: mappedItems, total };
  }

  async getAnnouncementDetail(id: number): Promise<AnnouncementDetailDto> {
    const announcement = await this.prisma.announcements.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            full_name: true,
            department: {
              select: {
                department_id: true,
                department_name: true,
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
      created_at: announcement.created_at,
      user_name: announcement.user.full_name,
      department_id: announcement.user.department.department_id,
      department_name: announcement.user.department.department_name,
      files: announcement.files.map((f) => ({
        id: f.id,
        fileName: f.file_name,
        fileUrl: f.file_url,
      })),
    };
  }
}
