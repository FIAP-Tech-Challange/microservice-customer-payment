import { CategoryModel } from '../../models/domain/category.model';

export const CATEGORY_REPOSITORY_PORT = 'CATEGORY_REPOSITORY_PORT';

export interface CategoryRepositoryPort {
  findById(id: string): Promise<CategoryModel | null>;
  findAll(storeId: string): Promise<CategoryModel[]>;
  save(category: CategoryModel): Promise<void>;
  findByName(name: string, storeId: string): Promise<CategoryModel | null>;
  delete(category: CategoryModel): Promise<void>;
}
