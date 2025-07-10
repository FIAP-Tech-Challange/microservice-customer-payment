import { ProductDTO } from '../DTOs/product.dto';
import { Product } from '../entities/product.entity';

export class ProductPresenter {
  static toDto(product: Product): ProductDTO {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
        store_id: product.storeId,
        prep_time: 0,
    };
  }
}