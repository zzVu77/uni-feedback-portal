// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { UsersServiceContract } from './users.service.contract';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { Users, Departments, FileTargetType } from '@prisma/client';
import { CreateAvatarAttachmentDto, FileAttachmentDto } from '../uploads/dto';
import { UploadsService } from '../uploads/uploads.service';

type UserWithDepartment = Users & {
  department?: Pick<Departments, 'id' | 'name' | 'email' | 'location'> | null;
  attachment: FileAttachmentDto | null;
};

@Injectable()
export class UsersService implements UsersServiceContract {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
  ) {}

  private mapToUserResponse(user: UserWithDepartment): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      attachment: user.attachment ?? null,
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
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
          },
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

    if (!user) {
      throw new NotFoundException(`User with ID ${actor.sub} not found`);
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: actor.sub },
      data: {
        ...(dto.fullName && { fullName: dto.fullName }),
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
          },
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
    if (!user) {
      throw new NotFoundException(`User with ID ${actor.sub} not found`);
    }
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
}
