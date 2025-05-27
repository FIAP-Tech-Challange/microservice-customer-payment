import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { ProductModel } from '../../models/domain/product.model';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { UpdateProductDto } from '../../models/dto/update-product.dto';

export interface ProductInputPort {
  findById(id: string, req: RequestFromStore): Promise<ProductModel>;
  findAll(req: RequestFromStore): Promise<ProductModel[]>;
  create(
    createProductDto: CreateProductDto,
    req: RequestFromStore,
  ): Promise<ProductModel>;
  update(
    id: string,
    updateProductDto: UpdateProductDto,
    req: RequestFromStore,
  ): Promise<ProductModel>;
  remove(id: string, req: RequestFromStore): Promise<void>;
}
