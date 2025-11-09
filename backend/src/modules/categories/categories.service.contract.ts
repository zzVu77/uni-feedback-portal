import { UserPayload } from 'src/shared/interfaces/user-payload.interface';
import {
  CreateCategoryDto,
  QueryCategoriesDto,
  UpdateCategoryDto,
  UpdateCategoryStatusDto,
} from './dto';
import {
  CategoryDto,
  CategoryListResponseDto,
} from './dto/category-response.dto';

export interface CategoriesServiceContract {
  /**
   * Creates a new category.
   * Requires ADMIN or DEPARTMENT_STAFF role.
   */
  CreateCategory(
    dto: CreateCategoryDto,
    user: UserPayload,
  ): Promise<CategoryDto>;

  /**
   * Retrieves a paginated and filterable list of categories.
   * Sorts active categories first.
   */
  GetAllCategories(query: QueryCategoriesDto): Promise<CategoryListResponseDto>;

  /**
   * Finds a single category by its ID.
   */
  GetCategoryById(id: string): Promise<CategoryDto>;

  /**
   * Updates a category's name.
   * Requires ADMIN or DEPARTMENT_STAFF role.
   */
  UpdateCategory(
    id: string,
    dto: UpdateCategoryDto,
    user: UserPayload,
  ): Promise<CategoryDto>;

  /**
   * Updates a category's active status (activates or deactivates it).
   * Requires ADMIN or DEPARTMENT_STAFF role.
   */
  UpdateCategoryStatus(
    id: string,
    dto: UpdateCategoryStatusDto,
    user: UserPayload,
  ): Promise<CategoryDto>;

  /**
   * Permanently deletes a category.
   * This action is restricted to ADMINS and will fail if the category is in use.
   */
  DeleteCategory(id: string, user: UserPayload): Promise<void>;
}
