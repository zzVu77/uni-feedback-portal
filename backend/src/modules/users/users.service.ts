import { Injectable, NotFoundException } from '@nestjs/common';
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
} from '@prisma/client';
import { CreateAvatarAttachmentDto, FileAttachmentDto } from '../uploads/dto';
import { UploadsService } from '../uploads/uploads.service';
import { HashingService } from '../auth/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
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
  }

  async getUsers(
    query: GetUsersQueryDto,
  ): Promise<{ results: UserResponseDto[]; total: number }> {
    const { page = 1, limit = 10, search, role, status, departmentId } = query;
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

    return {
      results: users.map((u) => this.mapToUserResponse(u)),
      total,
    };
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
