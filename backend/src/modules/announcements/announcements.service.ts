import { FileTargetType, Prisma, UserRole } from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  AnnouncementDetailDto,
  AnnouncementListResponseDto,
  CreateAnnouncementDto,
  QueryAnnouncementsDto,
  QueryStaffAnnouncementsDto,
  UpdateAnnouncementDto,
} from './dto';
import { UploadsService } from '../uploads/uploads.service';
import { FileAttachmentDto } from '../uploads/dto/file-attachment.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

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
        id: item.user.department?.id ?? 'null',
        name: item.user.department?.name ?? 'null',
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
        id: announcement.user.department?.id ?? 'null',
        name: announcement.user.department?.name ?? 'null',
      },
      files: files,
    };
  }
  async createAnnouncement(
    dto: CreateAnnouncementDto,
    actor: ActiveUserData,
  ): Promise<AnnouncementDetailDto> {
    this._ensureIsDepartmentStaff(actor);

    const announcement = await this.prisma.announcements.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId: actor.sub,
      },
      include: {
        user: {
          include: {
            department: true,
          },
        },
      },
    });

    let files: FileAttachmentDto[] = [];
    // Gọi service chuyên dụng để xử lý file
    if (dto.files && dto.files.length > 0) {
      files = await this.uploadsService.updateAttachmentsForTarget(
        announcement.id,
        FileTargetType.ANNOUNCEMENT,
        dto.files,
      );
    }

    // Trả về DTO được xây dựng thủ công
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
        id: announcement.user.department?.id ?? 'null',
        name: announcement.user.department?.name ?? 'null',
      },
      files: files,
    };
  }
  async updateAnnouncement(
    id: string,
    dto: UpdateAnnouncementDto,
    actor: ActiveUserData,
  ): Promise<AnnouncementDetailDto> {
    const existingAnnouncement = await this.prisma.announcements.findUnique({
      where: { id, userId: actor.sub },
      include: {
        user: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!existingAnnouncement)
      throw new NotFoundException('Announcement not found');

    const updatedAnnouncement = await this.prisma.announcements.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
      },
    });

    const files = await this.uploadsService.updateAttachmentsForTarget(
      id,
      FileTargetType.ANNOUNCEMENT,
      dto.files ?? [],
    );

    // 3. Trả về DTO được xây dựng thủ công
    return {
      id: updatedAnnouncement.id,
      title: updatedAnnouncement.title,
      content: updatedAnnouncement.content,
      createdAt: updatedAnnouncement.createdAt,
      user: {
        id: existingAnnouncement.user.id,
        userName: existingAnnouncement.user.fullName,
      },
      department: {
        id: existingAnnouncement.user.department?.id ?? 'null',
        name: existingAnnouncement.user.department?.name ?? 'null',
      },
      files: files,
    };
  }

  async deleteAnnouncement(
    id: string,
    actor: ActiveUserData,
  ): Promise<{ success: boolean }> {
    this._ensureIsDepartmentStaff(actor);

    const existing = await this.prisma.announcements.findUnique({
      where: { id, userId: actor.sub },
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

  private _ensureIsDepartmentStaff(actor: ActiveUserData) {
    if (actor.role !== UserRole.DEPARTMENT_STAFF) {
      throw new ForbiddenException(
        'This action is only allowed for Department Staff.',
      );
    }
  }
  async getStaffAnnouncements(
    query: QueryStaffAnnouncementsDto,
    actor: ActiveUserData,
  ): Promise<AnnouncementListResponseDto> {
    const { page = 1, pageSize = 10, q, from, to } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Build dynamic WHERE condition
    const where: Prisma.AnnouncementsWhereInput = {};
    // console.log('Actor:', actor);
    where.userId = actor.sub;
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
        id: item.user.department?.id ?? 'null',
        name: item.user.department?.name ?? 'null',
      },
    }));

    return { results: mappedItems, total };
  }

  async getStaffAnnouncementDetail(
    id: string,
    actor: ActiveUserData,
  ): Promise<AnnouncementDetailDto> {
    const announcement = await this.prisma.announcements.findUnique({
      where: { id, userId: actor.sub },
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
      throw new NotFoundException(
        `Announcement with id ${id} not found or you do not have permission to access it`,
      );
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
        id: announcement.user.department?.id ?? 'null',
        name: announcement.user.department?.name ?? 'null',
      },
      files: files,
    };
  }
}
