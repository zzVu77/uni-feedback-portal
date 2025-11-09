import { QueryCategoriesDto } from './dto/query-categories.dto';

export interface CategoriesServiceContract {
  list(query: QueryCategoriesDto): Promise<void>;
}
