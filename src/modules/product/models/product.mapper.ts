import { ProductModel } from './domain/product.model';
import { ProductEntity } from './entities/product.entity';

export class ProductMapper {
  static toEntity(productModel: ProductModel): ProductEntity {
    const productEntity = new ProductEntity();
    productEntity.id = productModel.id;
    productEntity.name = productModel.name;
    productEntity.price = productModel.price.toString();
    productEntity.is_active = productModel.is_active;
    productEntity.description = productModel.description;
    productEntity.prep_time = productModel.prep_time;
    productEntity.image_url = productModel.image_url;
    productEntity.created_at = productModel.created_at;
    productEntity.updated_at = productModel.updated_at;
    productEntity.store_id = productModel.store_id;

    return productEntity;
  }
}
