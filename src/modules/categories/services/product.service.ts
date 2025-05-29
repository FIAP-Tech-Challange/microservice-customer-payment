import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../ports/output/product-repository.port';
import { ProductModel } from '../models/domain/product.model';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async findById(id: string, storeId: string): Promise<ProductModel | null> {
    const product = await this.productRepository.findById(id);

    if (!product || product.store_id !== storeId) {
      return null;
    }

    return product;
  }
}
