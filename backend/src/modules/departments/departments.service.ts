import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateDepartmentDto,
  DepartmentDto,
  DepartmentListResponseDto,
  QueryDepartmentsDto,
  UpdateDepartmentDto,
  UpdateDepartmentStatusDto,
} from './dto';
import { Departments, Prisma, UserRole } from '@prisma/client';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

// Define a more specific type for the department object coming from Prisma queries
type DepartmentWithCounts = Departments & {
  _count?: {
    feedbacks: number;
  };
};

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private checkAdmin(role: UserRole) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to perform this action. Admin role required.',
      );
    }
  }

  private async getDepartmentOrThrow(id: string) {
    const department = await this.prisma.departments.findUnique({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found.`);
    }
    return department;
  }

  private mapToDto = (department: DepartmentWithCounts): DepartmentDto => {
    return {
      id: department.id,
      name: department.name,
      email: department.email,
      description: department.description
        ? department.description
        : 'Not found',
      location: department.location ? department.location : 'Not found',
      phone: department.phone ? department.phone : 'Not found',
      isActive: department.isActive,
      createdAt: department.createdAt.toISOString(),
      feedbackCount: department._count?.feedbacks ?? 0,
      // staffCount: department._count?.users ?? 0,
    };
  };

  async createDepartment(
    dto: CreateDepartmentDto,
    user: ActiveUserData,
  ): Promise<DepartmentDto> {
    this.checkAdmin(user.role);

    const existing = await this.prisma.departments.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(
        `Department with email "${dto.email}" already exists.`,
      );
    }

    const department = await this.prisma.departments.create({
      data: dto,
      include: {
        _count: {
          select: { feedbacks: true },
        },
      },
    });

    return this.mapToDto(department);
  }

  async getAllDepartments(
    query: QueryDepartmentsDto,
  ): Promise<DepartmentListResponseDto> {
    const { page = 1, pageSize = 10, q, isActive } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.DepartmentsWhereInput = {
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      }),
    };

    const [departments, total] = await this.prisma.$transaction([
      this.prisma.departments.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
        include: {
          _count: {
            select: { feedbacks: true },
          },
        },
      }),
      this.prisma.departments.count({ where }),
    ]);

    return {
      results: departments.map(this.mapToDto),
      total,
    };
  }

  async getDepartmentById(id: string): Promise<DepartmentDto> {
    const department = await this.prisma.departments.findUnique({
      where: { id },
      include: {
        _count: {
          select: { feedbacks: true },
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found.`);
    }

    return this.mapToDto(department);
  }

  async updateDepartment(
    id: string,
    dto: UpdateDepartmentDto,
    user: ActiveUserData,
  ): Promise<DepartmentDto> {
    this.checkAdmin(user.role);
    await this.getDepartmentOrThrow(id);

    if (dto.email) {
      const existing = await this.prisma.departments.findFirst({
        where: { email: dto.email, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException(
          `Department with email "${dto.email}" already exists.`,
        );
      }
    }

    const updatedDepartment = await this.prisma.departments.update({
      where: { id },
      data: dto,
      include: {
        _count: {
          select: { feedbacks: true },
        },
      },
    });

    return this.mapToDto(updatedDepartment);
  }

  async updateDepartmentStatus(
    id: string,
    dto: UpdateDepartmentStatusDto,
    user: ActiveUserData,
  ): Promise<DepartmentDto> {
    this.checkAdmin(user.role);
    await this.getDepartmentOrThrow(id);

    const updatedDepartment = await this.prisma.departments.update({
      where: { id },
      data: { isActive: dto.isActive },
      include: {
        _count: {
          select: { feedbacks: true },
        },
      },
    });

    return this.mapToDto(updatedDepartment);
  }

  async deleteDepartment(id: string, user: ActiveUserData): Promise<void> {
    this.checkAdmin(user.role);
    await this.getDepartmentOrThrow(id);

    const [userCount, feedbackCount] = await this.prisma.$transaction([
      this.prisma.users.count({ where: { departmentId: id } }),
      this.prisma.feedbacks.count({ where: { departmentId: id } }),
    ]);

    if (userCount > 0 || feedbackCount > 0) {
      throw new ForbiddenException(
        `Cannot delete department. It is linked to ${userCount} user(s) and ${feedbackCount} feedback(s). Please deactivate it instead.`,
      );
    }

    await this.prisma.departments.delete({ where: { id } });
  }
}
