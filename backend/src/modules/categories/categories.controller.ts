import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  CategoryDto,
  CategoryListResponseDto,
  QueryCategoriesDto,
  CategoryParamDto,
  UpdateCategoryDto,
  UpdateCategoryStatusDto,
  CategoryOptionResponseDto,
} from './dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: CategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid data.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<CategoryDto> {
    return this.categoriesService.createCategory(createCategoryDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of categories',
    description: 'Retrieves a paginated list of active categories.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of categories.',
    type: CategoryListResponseDto,
  })
  getAllCategories(
    @Query() query: QueryCategoriesDto,
  ): Promise<CategoryListResponseDto> {
    return this.categoriesService.getAllCategories(query);
  }
  @Get('options')
  @ApiOperation({ summary: 'Get a list of categories' })
  @ApiResponse({
    status: 200,
    description: 'A list of categories.',
    type: [CategoryOptionResponseDto],
  })
  getCategoryOptions(): Promise<CategoryOptionResponseDto[]> {
    return this.categoriesService.getCategoryOptions();
  }

  @Patch(':categoryId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a category (Admin only)' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: CategoryDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  updateCategory(
    @Param() params: CategoryParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<CategoryDto> {
    return this.categoriesService.updateCategory(
      params.categoryId,
      updateCategoryDto,
      user,
    );
  }

  @Patch(':categoryId/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Activate or deactivate a category (Admin only)',
    description: 'Updates the active status of a category.',
  })
  @ApiBody({ type: UpdateCategoryStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Category status updated successfully.',
    type: CategoryDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  updateCategoryStatus(
    @Param() params: CategoryParamDto,
    @Body() updateStatusDto: UpdateCategoryStatusDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<CategoryDto> {
    return this.categoriesService.updateCategoryStatus(
      params.categoryId,
      updateStatusDto,
      user,
    );
  }

  @Delete(':categoryId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Permanently delete a category (Admin only)',
    description:
      'Permanently deletes a category from the database. This action will fail if the category is associated with any feedbacks.',
  })
  @ApiResponse({
    status: 204,
    description: 'Category successfully deleted permanently.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden to hard-delete a category that is in use.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  hardDeleteCategory(
    @Param() params: CategoryParamDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<void> {
    return this.categoriesService.deleteCategory(params.categoryId, user);
  }
}
