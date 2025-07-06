import { CategoryDataSourceDTO } from 'src-clean/common/dataSource/DTOs/categoryDataSource.dto';
import { Category } from '../entities/category.entity';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CoreException } from 'src-clean/common/exceptions/coreException';
import { ProductMapper } from './product.mapper';
import { Product } from '../entities/product.entity';

export class CategoryMapper {
    static toPersistenceDTO(category: Category) {
        throw new Error('Method not implemented.');
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
