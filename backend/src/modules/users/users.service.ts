import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { UsersServiceContract } from './users.service.contract';
import { UpdateProfileDto } from './dto/update-profile.dto';

import {
  Users,
  Departments,
  FileTargetType,
  Prisma,
  UserStatus,
  ReportDecision,
} from '@prisma/client';
import { CreateAvatarAttachmentDto, FileAttachmentDto } from '../uploads/dto';
import { UploadsService } from '../uploads/uploads.service';
import { HashingService } from '../auth/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto, UserOrderBy } from './dto/get-users-query.dto';
import { GetUserViolationsQueryDto } from './dto/get-user-violations-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

type UserWithDepartment = Users & {
  department?: Pick<Departments, 'id' | 'name' | 'email' | 'location'> | null;
  attachment?: FileAttachmentDto | null;
};

@Injectable()
export class UsersService implements UsersServiceContract {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
    private hashingService: HashingService,
  ) {}

  private getRollingDateLimit(lookbackDays: number): Date {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - lookbackDays);
    return dateLimit;
  }

  private mapToUserResponse(user: UserWithDepartment): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      deactivatedUntil: user.deactivatedUntil?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      avatarUrl: user.attachment?.fileUrl ?? '',
      ...(user.department
        ? {
            department: {
              id: user.department.id,
              name: user.department.name,
              email: user.department.email ?? undefined,
              location: user.department.location,
            },
          }
        : {}),
    };
  }

  async getUser(actor: ActiveUserData): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id: actor.sub },
      include: {
        department: {
          select: { id: true, name: true, email: true, location: true },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${actor.sub} not found`);
    }
    const attachment = await this.uploadsService.getAttachmentsForTarget(
      user.id,
      FileTargetType.AVATAR,
    );
    return this.mapToUserResponse({
      ...user,
      attachment: attachment?.[0] ?? null,
    });
  }

  async updateMe(
    actor: ActiveUserData,
    dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id: actor.sub },
    });
    if (!user)
      throw new NotFoundException(`User with ID ${actor.sub} not found`);

    const updatedUser = await this.prisma.users.update({
      where: { id: actor.sub },
      data: { ...(dto.fullName && { fullName: dto.fullName }) },
      include: {
        department: {
          select: { id: true, name: true, email: true, location: true },
        },
      },
    });
    let attachment: FileAttachmentDto[] = [];
    if (dto.attachment) {
      attachment = await this.uploadsService.updateAttachmentsForTarget(
        user.id,
        FileTargetType.AVATAR,
        [dto.attachment],
      );
    }
    return this.mapToUserResponse({
      ...updatedUser,
      attachment: attachment?.[0] ?? null,
    });
  }

  async uploadAvatar(
    actor: ActiveUserData,
    fileAttachment: CreateAvatarAttachmentDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id: actor.sub },
    });
    if (!user)
      throw new NotFoundException(`User with ID ${actor.sub} not found`);

    let files: FileAttachmentDto[] = [];
    if (fileAttachment) {
      files = await this.uploadsService.updateAttachmentsForTarget(
        user.id,
        FileTargetType.AVATAR,
        [fileAttachment],
      );
    }
    return this.mapToUserResponse({ ...user, attachment: files?.[0] ?? null });
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const hashedPassword = await this.hashingService.hash(dto.password);
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          fullName: dto.fullName,
          role: dto.role,
          departmentId: dto.departmentId,
        },
        include: {
          department: {
            select: { id: true, name: true, email: true, location: true },
          },
        },
      });
      return this.mapToUserResponse(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  private async getViolationCounts(
    userIds: string[],
    dateLimit: Date,
  ): Promise<Map<string, number>> {
    const violationMap = new Map<string, number>();
    if (userIds.length === 0) {
      return violationMap;
    }

    const violations = await this.prisma.commentReports.findMany({
      where: {
        comment: {
          userId: { in: userIds },
        },
        decision: ReportDecision.VIOLATION,
        updatedAt: { gte: dateLimit },
      },
      select: {
        comment: {
          select: {
            userId: true,
          },
        },
      },
    });

    violations.forEach((v) => {
      if (v.comment.userId) {
        violationMap.set(
          v.comment.userId,
          (violationMap.get(v.comment.userId) || 0) + 1,
        );
      }
    });

    return violationMap;
  }

  async getUsers(
    query: GetUsersQueryDto,
  ): Promise<{ results: UserResponseDto[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      departmentId,
      lookbackDays = 30,
      orderBy = 'createdAt_desc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UsersWhereInput = {
      ...(role && { role }),
      ...(status && { status }),
      ...(departmentId && { departmentId }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const dateLimit = this.getRollingDateLimit(lookbackDays);

    if (
      orderBy === UserOrderBy.VIOLATION_COUNT_DESC ||
      orderBy === UserOrderBy.VIOLATION_COUNT_ASC
    ) {
      const allUsers = await this.prisma.users.findMany({
        where,
        include: {
          department: {
            select: { id: true, name: true, email: true, location: true },
          },
        },
      });

      const userIds = allUsers.map((u) => u.id);
      const violationMap = await this.getViolationCounts(userIds, dateLimit);

      const usersWithCount = allUsers.map((u) => ({
        ...u,
        violationCount: violationMap.get(u.id) || 0,
      }));

      usersWithCount.sort((a, b) => {
        if (orderBy === UserOrderBy.VIOLATION_COUNT_DESC)
          return b.violationCount - a.violationCount;
        return a.violationCount - b.violationCount;
      });

      const total = usersWithCount.length;
      const paginatedUsers = usersWithCount.slice(skip, skip + limit);

      return {
        results: paginatedUsers.map((u) => {
          const res = this.mapToUserResponse(u);
          res.violationCount = u.violationCount;
          return res;
        }),
        total,
      };
    } else {
      const [users, total] = await Promise.all([
        this.prisma.users.findMany({
          where,
          skip,
          take: limit,
          include: {
            department: {
              select: { id: true, name: true, email: true, location: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.users.count({ where }),
      ]);

      const userIds = users.map((u) => u.id);
      const violationMap = await this.getViolationCounts(userIds, dateLimit);

      return {
        results: users.map((u) => {
          const res = this.mapToUserResponse(u);
          res.violationCount = violationMap.get(u.id) || 0;
          return res;
        }),
        total,
      };
    }
  }

  async getUserViolations(userId: string, query: GetUserViolationsQueryDto) {
    const { lookbackDays = 30, page = 1, limit = 10 } = query;
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const skip = (page - 1) * limit;
    const dateLimit = this.getRollingDateLimit(lookbackDays);

    const where: Prisma.CommentReportsWhereInput = {
      comment: {
        userId,
      },
      decision: ReportDecision.VIOLATION,
      updatedAt: { gte: dateLimit },
    };

    const [results, total] = await Promise.all([
      this.prisma.commentReports.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          comment: true,
        },
      }),
      this.prisma.commentReports.count({ where }),
    ]);

    return { results, total };
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        department: {
          select: { id: true, name: true, email: true, location: true },
        },
      },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const attachment = await this.uploadsService.getAttachmentsForTarget(
      user.id,
      FileTargetType.AVATAR,
    );
    return this.mapToUserResponse({
      ...user,
      attachment: attachment?.[0] ?? null,
    });
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const updateData: Prisma.UsersUpdateInput = {
      ...(dto.fullName && { fullName: dto.fullName }),
      ...(dto.email && { email: dto.email }),
      ...(dto.role && { role: dto.role }),
      ...(dto.departmentId !== undefined && {
        department: dto.departmentId
          ? { connect: { id: dto.departmentId } }
          : { disconnect: true },
      }),
    };

    if (dto.password) {
      updateData.password = await this.hashingService.hash(dto.password);
    }

    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: updateData,
        include: {
          department: {
            select: { id: true, name: true, email: true, location: true },
          },
        },
      });
      return this.mapToUserResponse(updatedUser);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async updateUserStatus(
    id: string,
    dto: UpdateUserStatusDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    let deactivatedUntil = null;
    if (dto.status === UserStatus.DEACTIVATED && dto.durationDays) {
      const date = new Date();
      date.setDate(date.getDate() + dto.durationDays);
      deactivatedUntil = date;
    }

    const updateData: Prisma.UsersUpdateInput = {
      status: dto.status,
      deactivatedUntil,
    };

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: updateData,
      include: {
        department: {
          select: { id: true, name: true, email: true, location: true },
        },
      },
    });
    return this.mapToUserResponse(updatedUser);
  }

  // async softDeleteUser(id: string): Promise<void> {
  //   const user = await this.prisma.users.findUnique({ where: { id } });
  //   if (!user) throw new NotFoundException(`User with ID ${id} not found`);

  //   await this.prisma.users.update({
  //     where: { id },
  //     data: { status: UserStatus.PERMANENTLY_DELETED },
  //   });
  // }
}
