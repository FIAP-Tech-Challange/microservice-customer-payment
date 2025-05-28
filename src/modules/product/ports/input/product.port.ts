import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { UpdateProductDto } from '../../models/dto/update-product.dto';
import { ProductResponseDto } from '../../models/dto/product-response.dto';

export interface ProductInputPort {
  findById(id: string, req: RequestFromStore): Promise<ProductResponseDto>;
  findAll(req: RequestFromStore): Promise<ProductResponseDto[]>;
  create(
    createProductDto: CreateProductDto,
    req: RequestFromStore,
  ): Promise<ProductResponseDto>;
  update(
    id: string,
    updateProductDto: UpdateProductDto,
    req: RequestFromStore,
  ): Promise<ProductResponseDto>;
  remove(id: string, req: RequestFromStore): Promise<void>;
}
