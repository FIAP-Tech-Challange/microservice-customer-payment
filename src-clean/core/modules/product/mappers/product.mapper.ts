import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Product } from '../entities/product.entity';
import { ProductDataSourceDTO } from 'src-clean/common/dataSource/DTOs/productDataSource.dto';

export class ProductMapper {
  static toEntity(dto: ProductDataSourceDTO): CoreResponse<Product> {
    return Product.restore({
        id: dto.id,
        name: dto.name,
        createdAt: new Date(dto.created_at),
        price: 0,
        description: '',
        prepTime: 0,
        updatedAt: new Date(),
        storeId: ''
    });
  }

  static toPersistenceDTO(entity: Product): ProductDataSourceDTO {
    return {
        id: entity.id,
        name: entity.name,
        created_at: entity.createdAt ?? new Date(),
        price: 0,
        prep_time: 0,
        updated_at: entity.updatedAt ?? new Date(),
        store_id: ''
    };
  }
}