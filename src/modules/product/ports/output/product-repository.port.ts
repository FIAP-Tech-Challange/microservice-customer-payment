import { ProductModel } from "../../models/product.model";

export interface ProductRepositoryPort {
  findAll(): Promise<ProductModel[]>;
  findById(id: number): Promise<ProductModel>;
  create(product: Partial<ProductModel>): Promise<ProductModel>;
  update(id: number, product: Partial<ProductModel>): Promise<ProductModel>;
  delete(id: number): Promise<void>;
}