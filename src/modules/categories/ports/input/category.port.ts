import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import {
  CategoryResponseDto,
  ProductResponseDto,
} from '../../models/dto/category-response.dto';

export interface CategoryInputPort {
  findAll(req: RequestFromStore): Promise<CategoryResponseDto[]>;
  findById(id: string, req: RequestFromStore): Promise<CategoryResponseDto>;
  create(name: string, req: RequestFromStore): Promise<CategoryResponseDto>;
  delete(id: string, req: RequestFromStore): Promise<void>;

  createProduct(
    categoryId: string,
    createProductDto: CreateProductDto,
    req: RequestFromStore,
  ): Promise<ProductResponseDto>;
  deleteProduct(
    categoryId: string,
    productId: string,
    req: RequestFromStore,
  ): Promise<void>;
}
