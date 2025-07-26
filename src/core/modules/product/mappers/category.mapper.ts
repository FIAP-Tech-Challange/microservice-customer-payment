import { CategoryDataSourceDTO } from 'src/common/dataSource/DTOs/categoryDataSource.dto';
import { Category } from '../entities/category.entity';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CoreException } from 'src/common/exceptions/coreException';
import { ProductMapper } from './product.mapper';
import { Product } from '../entities/product.entity';

export class CategoryMapper {
  static toPersistenceDTO(category: Category): CategoryDataSourceDTO {
    return {
      id: category.id,
      name: category.name,
      created_at: category.createdAt.toISOString(),
      updated_at: category.updatedAt.toISOString(),
      store_id: category.storeId,
      products: category.products.map((product) =>
        ProductMapper.toPersistenceDTO(product),
      ),
    };
  }
  static toEntity(dto: CategoryDataSourceDTO): CoreResponse<Category> {
    const products: Product[] = [];

    try {
      dto.products.forEach((product) => {
        const { error, value } = ProductMapper.toEntity(product);

        if (error) throw error;

        products.push(value);
      });
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }

    return Category.restore({
      id: dto.id,
      name: dto.name,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      products: products,
      storeId: dto.store_id,
    });
  }
}
