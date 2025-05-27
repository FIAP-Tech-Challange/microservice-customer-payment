import { ProductModel } from '../../models/domain/product.model';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { UpdateProductDto } from '../../models/dto/update-product.dto';

export interface ProductInputPort {
  remove(id: number): unknown;
  findById(id: number): Promise<ProductModel>;
  findAll(): Promise<ProductModel[]>;
  create(createProductDto: CreateProductDto): Promise<ProductModel>;
  update(id: number, updateProductDto: UpdateProductDto): Promise<ProductModel>;
  remove(id: number): Promise<void>;
}