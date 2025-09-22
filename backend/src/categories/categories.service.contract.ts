import { QueryCategoriesDto } from './dto/query-categories.dto';
import { CategoryResponseDto } from './dto/category-item.dto';

export interface CategoriesServiceContract {
  list(query: QueryCategoriesDto): Promise<{ items: CategoryResponseDto[] }>;
}
