import { ProductModel } from '../../models/domain/product.model';

export interface ProductRepositoryPort {
  findAll(): Promise<ProductModel[]>;
  findById(id: number): Promise<ProductModel | null>;
  create(product: Partial<ProductModel>): Promise<ProductModel>;
  update(id: number, product: Partial<ProductModel>): Promise<ProductModel>;
  delete(id: number): Promise<void>;
}