import { CategoryDTO } from '../DTOs/category.dto';
import { Category } from '../entities/category.entity';
import { ProductPresenter } from './product.presenter';

export class CategoryPresenter {
  static toDto(category: Category): CategoryDTO {
    return {
        id: category.id,
        name: category.name,
        products: category.products.map((product) => ProductPresenter.toDto(product)),
        store_id: category.storeId,
        created_at: category.createdAt || new Date(),
        updated_at: category.updatedAt || new Date()
    };
  }
}