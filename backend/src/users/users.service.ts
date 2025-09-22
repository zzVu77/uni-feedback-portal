// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getById(params: number): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { user_id: params },
      select: {
        user_id: true,
        full_name: true,
        email: true,
        role: true,
        department_id: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      created_at: user.created_at.toISOString(),
    };
  }
}
