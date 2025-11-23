import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import {
  CategoryDto,
  CategoryListResponseDto,
  CreateCategoryDto,
  QueryCategoriesDto,
  UpdateCategoryDto,
  UpdateCategoryStatusDto,
} from './dto';

export interface CategoriesServiceContract {
  createCategory(
    dto: CreateCategoryDto,
    user: ActiveUserData,
  ): Promise<CategoryDto>;

  getAllCategories(query: QueryCategoriesDto): Promise<CategoryListResponseDto>;

  getCategoryById(id: string): Promise<CategoryDto>;

  updateCategory(
    id: string,
    dto: UpdateCategoryDto,
    user: ActiveUserData,
  ): Promise<CategoryDto>;

  updateCategoryStatus(
    id: string,
    dto: UpdateCategoryStatusDto,
    user: ActiveUserData,
  ): Promise<CategoryDto>;

  deleteCategory(id: string, user: ActiveUserData): Promise<void>;
}
