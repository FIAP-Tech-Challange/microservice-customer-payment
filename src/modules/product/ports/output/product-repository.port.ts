import { ProductModel } from '../../models/domain/product.model';

export interface ProductRepositoryPort {
  findById(id: string): Promise<ProductModel | null>;
  findAll(storeId: string): Promise<ProductModel[]>;
  create(product: ProductModel): Promise<void>;
  update(product: ProductModel): Promise<void>;
  delete(product: ProductModel): Promise<void>;
}
