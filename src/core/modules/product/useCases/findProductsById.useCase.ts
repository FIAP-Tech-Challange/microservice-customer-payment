import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Product } from '../entities/product.entity';
import { ProductGateway } from '../gateways/product.gateway';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

export class FindProductsByIdUseCase {
  constructor(private productGateway: ProductGateway) {}

  async execute(
    productIds: string[],
    storeId: string,
  ): Promise<CoreResponse<Product[]>> {
    if (!productIds || productIds.length === 0) {
      return {
        error: new ResourceInvalidException('No product IDs provided'),
        value: undefined,
      };
    }

    const products = await this.productGateway.findProductsById(productIds);
    if (products.error) {
      return { error: products.error, value: undefined };
    }

    products.value.filter((p) => p.storeId !== storeId);

    if (products.value.length !== productIds.length) {
      return {
        value: undefined,
        error: new ResourceNotFoundException('Some products were not found'),
      };
    }

    return { error: undefined, value: products.value };
  }
}
