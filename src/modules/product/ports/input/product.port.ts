import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { ProductModel } from '../../models/domain/product.model';
import { CreateProductDto } from '../../models/dto/create-product.dto';
import { UpdateProductDto } from '../../models/dto/update-product.dto';

export interface ProductInputPort {
  findById(id: string): Promise<ProductModel>;
  findAll(): Promise<ProductModel[]>;
  create(
    createProductDto: CreateProductDto,
    req: RequestFromStore,
  ): Promise<ProductModel>;
  update(id: string, updateProductDto: UpdateProductDto): Promise<ProductModel>;
  remove(id: string): Promise<void>;
}
