// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
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

    const result: UserResponseDto = {
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
              email: user.department.email,
              location: user.department.location,
            },
          }
        : {}),
    };

    return result;
  }
}
