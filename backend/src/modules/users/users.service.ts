// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { UsersServiceContract } from './users.service.contract';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { Users, Departments } from '@prisma/client';

type UserWithDepartment = Users & {
  department?: Pick<Departments, 'id' | 'name' | 'email' | 'location'> | null;
};

@Injectable()
export class UsersService implements UsersServiceContract {
  constructor(private prisma: PrismaService) {}

  private mapToUserResponse(user: UserWithDepartment): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
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

    return this.mapToUserResponse(user);
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

    return this.mapToUserResponse(updatedUser);
  }
}
