import { CategoryModel } from './domain/category.model';
import { CategoryEntity } from './entities/category.entity';
import { ProductMapper } from './product.mapper';

export class CategoryMapper {
  static toEntity(categoryModel: CategoryModel): CategoryEntity {
    const categoryEntity = new CategoryEntity();
    categoryEntity.id = categoryModel.id;
    categoryEntity.name = categoryModel.name;
    categoryEntity.is_active = categoryModel.isActive;
    categoryEntity.store_id = categoryModel.storeId;
    categoryEntity.created_at = categoryModel.createdAt;
    categoryEntity.updated_at = categoryModel.updatedAt;
    categoryEntity.products = categoryModel.products.map((product) =>
      ProductMapper.toEntity(product),
    );

    return categoryEntity;
  }

  static toModel(categoryEntity: CategoryEntity): CategoryModel {
    const categoryModel = CategoryModel.restore({
      id: categoryEntity.id,
      name: categoryEntity.name,
      isActive: categoryEntity.is_active,
      products: categoryEntity.products.map((product) =>
        ProductMapper.toModel(product),
      ),
      createdAt: categoryEntity.created_at,
      updatedAt: categoryEntity.updated_at,
      storeId: categoryEntity.store_id,
    });

    return categoryModel;
  }
}
