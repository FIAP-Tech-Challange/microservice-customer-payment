import { ProductDTO } from '../DTOs/product.dto';
import { Product } from '../entities/product.entity';

export class ProductPresenter {
  static toDto(product: Product): ProductDTO {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      prepTime: product.prepTime,
      imageUrl: product.imageUrl,
    };
  }
}
