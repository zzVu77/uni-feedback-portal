import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateCategoryDto,
  QueryCategoriesDto,
  UpdateCategoryDto,
  UpdateCategoryStatusDto, // Import DTO mới
} from './dto';
import {
  CategoryDto,
  CategoryListResponseDto,
} from './dto/category-response.dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private _ensureIsAdmin(user: ActiveUserData) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }
  }

  async createCategory(
    dto: CreateCategoryDto,
    user: ActiveUserData,
  ): Promise<CategoryDto> {
    this._ensureIsAdmin(user);

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

  async getAllCategories(
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

  async getCategoryById(id: string): Promise<CategoryDto> {
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

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
    user: ActiveUserData,
  ): Promise<CategoryDto> {
    this._ensureIsAdmin(user);

    await this.getCategoryById(id); // Check if category exists

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

  async updateCategoryStatus(
    id: string,
    dto: UpdateCategoryStatusDto,
    user: ActiveUserData,
  ): Promise<CategoryDto> {
    this._ensureIsAdmin(user);

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

  async deleteCategory(id: string, user: ActiveUserData): Promise<void> {
    this._ensureIsAdmin(user);

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
