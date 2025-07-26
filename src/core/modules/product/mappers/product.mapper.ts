import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Product } from '../entities/product.entity';
import { ProductDataSourceDTO } from 'src/common/dataSource/DTOs/productDataSource.dto';

export class ProductMapper {
  static toEntity(dto: ProductDataSourceDTO): CoreResponse<Product> {
    return Product.restore({
      id: dto.id,
      name: dto.name,
      price: dto.price,
      description: dto.description,
      prepTime: dto.prep_time,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      storeId: dto.store_id,
    });
  }

  static toPersistenceDTO(entity: Product): ProductDataSourceDTO {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      description: entity.description,
      prep_time: entity.prepTime,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
      store_id: entity.storeId,
    };
  }
}
