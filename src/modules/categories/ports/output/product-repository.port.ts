import { ProductModel } from '../../models/domain/product.model';

export const PRODUCT_REPOSITORY_PORT = 'PRODUCT_REPOSITORY_PORT';

export interface ProductRepositoryPort {
  findById(id: string): Promise<ProductModel | null>;
}
