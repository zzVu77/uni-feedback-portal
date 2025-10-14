// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getById(userId: number): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { userId: userId },
      select: {
        userId: true,
        fullName: true,
        email: true,
        role: true,
        departmentId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
