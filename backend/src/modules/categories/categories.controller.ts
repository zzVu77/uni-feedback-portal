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
  // UseGuards, // You would uncomment this when you implement authentication
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserPayload } from 'src/shared/interfaces/user-payload.interface';
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

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
// @UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private readonly dummyUser: UserPayload = {
    userId: '550e8400-e29b-41d4-a716-44665544000a',
    role: UserRole.ADMIN,
  };

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    type: CategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid data.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  CreateCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const user = this.dummyUser;
    return this.categoriesService.CreateCategory(createCategoryDto, user);
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
  GetAllCategories(
    @Query() query: QueryCategoriesDto,
  ): Promise<CategoryListResponseDto> {
    return this.categoriesService.GetAllCategories(query);
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
  @Get(':categoryId')
  @ApiOperation({ summary: 'Get a single category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category details retrieved successfully.',
    type: CategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  GetCategoryById(@Param() params: CategoryParamDto): Promise<CategoryDto> {
    return this.categoriesService.GetCategoryById(params.categoryId);
  }

  @Patch(':categoryId')
  @ApiOperation({ summary: 'Update a category' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    type: CategoryDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  UpdateCategory(
    @Param() params: CategoryParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
    // @AuthUser() user: UserPayload,
  ): Promise<CategoryDto> {
    const user = this.dummyUser; // Using dummy user for now
    return this.categoriesService.UpdateCategory(
      params.categoryId,
      updateCategoryDto,
      user,
    );
  }

  @Patch(':categoryId/status')
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.DEPARTMENT_STAFF)
  @ApiOperation({
    summary: 'Activate or deactivate a category',
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
  UpdateCategoryStatus(
    @Param() params: CategoryParamDto,
    @Body() updateStatusDto: UpdateCategoryStatusDto,
    // @AuthUser() user: UserPayload,
  ): Promise<CategoryDto> {
    const user = this.dummyUser;
    return this.categoriesService.UpdateCategoryStatus(
      params.categoryId,
      updateStatusDto,
      user,
    );
  }

  @Delete(':categoryId')
  // @UseGuards(RolesGuard)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Permanently delete a category (Hard Delete)',
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
  HardDeleteCategory(
    @Param() params: CategoryParamDto,
    // @AuthUser() user: UserPayload,
  ): Promise<void> {
    const user = this.dummyUser; // Using dummy user for now
    return this.categoriesService.DeleteCategory(params.categoryId, user);
  }
}
