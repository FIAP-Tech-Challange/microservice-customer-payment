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

  static toModel(productEntity: ProductEntity): ProductModel {
    const productModel = ProductModel.restore({
      id: productEntity.id,
      name: productEntity.name,
      price: parseFloat(productEntity.price),
      is_active: productEntity.is_active,
      description: productEntity.description,
      prep_time: productEntity.prep_time,
      image_url: productEntity.image_url,
      created_at: productEntity.created_at,
      updated_at: productEntity.updated_at,
      store_id: productEntity.store_id,
    });

    return productModel;
  }
}
