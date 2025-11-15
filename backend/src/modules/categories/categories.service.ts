import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserPayload } from 'src/shared/interfaces/user-payload.interface';
import {
  CreateCategoryDto,
  QueryCategoriesDto,
  UpdateCategoryDto,
  UpdateCategoryStatusDto, // Import DTO mới
} from './dto';
import {
  CategoryDto,
  CategoryListResponseDto,
  CategoryOptionResponseDto,
} from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private checkAdminOrStaff(role: UserRole) {
    if (role !== UserRole.ADMIN && role !== UserRole.DEPARTMENT_STAFF) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }
  }

  async CreateCategory(
    dto: CreateCategoryDto,
    user: UserPayload,
  ): Promise<CategoryDto> {
    this.checkAdminOrStaff(user.role);

    const existingCategory = await this.prisma.categories.findFirst({
      where: { name: { equals: dto.name, mode: 'insensitive' } },
    });

    if (existingCategory) {
      throw new ConflictException(
        `A category with the name "${dto.name}" already exists.`,
      );
    }

    const category = await this.prisma.categories.create({
      data: {
        name: dto.name,
      },
    });

    return {
      id: category.id,
      name: category.name,
      isActive: category.isActive,
      feedbackCount: 0,
    };
  }
  async getCategoryOptions(): Promise<CategoryOptionResponseDto[]> {
    const categories = await this.prisma.categories.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });
    return categories;
  }
  async GetAllCategories(
    query: QueryCategoriesDto,
  ): Promise<CategoryListResponseDto> {
    const { page = 1, pageSize = 10, q, isActive } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.CategoriesWhereInput = {
      // Conditionally filter by isActive status if the parameter is provided
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(q && { name: { contains: q, mode: 'insensitive' } }),
    };

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.categories.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [
          { isActive: 'desc' }, // Sort by active status first (true comes before false)
          { name: 'asc' }, // Then sort by name alphabetically
        ],
        include: {
          _count: {
            select: { feedbacks: true },
          },
        },
      }),
      this.prisma.categories.count({ where }),
    ]);

    const results = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      isActive: cat.isActive,
      feedbackCount: cat._count.feedbacks,
    }));

    return { results, total };
  }

  async GetCategoryById(id: string): Promise<CategoryDto> {
    const category = await this.prisma.categories.findUnique({
      where: { id, isActive: true },
      include: {
        _count: {
          select: { feedbacks: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    return {
      id: category.id,
      name: category.name,
      isActive: category.isActive,
      feedbackCount: category._count.feedbacks,
    };
  }

  async UpdateCategory(
    id: string,
    dto: UpdateCategoryDto,
    user: UserPayload,
  ): Promise<CategoryDto> {
    this.checkAdminOrStaff(user.role);

    await this.GetCategoryById(id); // Check if category exists

    if (dto.name) {
      const existingCategory = await this.prisma.categories.findFirst({
        where: {
          name: { equals: dto.name, mode: 'insensitive' },
          id: { not: id },
        },
      });
      if (existingCategory) {
        throw new ConflictException(
          `A category with the name "${dto.name}" already exists.`,
        );
      }
    }

    const updatedCategory = await this.prisma.categories.update({
      where: { id },
      data: dto,
      include: {
        _count: {
          select: { feedbacks: true },
        },
      },
    });

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      isActive: updatedCategory.isActive,
      feedbackCount: updatedCategory._count.feedbacks,
    };
  }

  async UpdateCategoryStatus(
    id: string,
    dto: UpdateCategoryStatusDto,
    user: UserPayload,
  ): Promise<CategoryDto> {
    this.checkAdminOrStaff(user.role);

    const category = await this.prisma.categories.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    const updatedCategory = await this.prisma.categories.update({
      where: { id },
      data: { isActive: dto.isActive },
      include: {
        _count: {
          select: { feedbacks: true },
        },
      },
    });

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      isActive: updatedCategory.isActive,
      feedbackCount: updatedCategory._count.feedbacks,
    };
  }

  async DeleteCategory(id: string, user: UserPayload): Promise<void> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only Admins can permanently delete categories.',
      );
    }

    const feedbackCount = await this.prisma.feedbacks.count({
      where: { categoryId: id },
    });

    if (feedbackCount > 0) {
      throw new ForbiddenException(
        `Cannot permanently delete category because it is associated with ${feedbackCount} feedback(s). Please use the deactivate (soft delete) option instead.`,
      );
    }

    const result = await this.prisma.categories.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
  }
}
