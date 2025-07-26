import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { Product } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CoreException } from 'src/common/exceptions/coreException';

export class ProductGateway {
  constructor(private dataSource: DataSource) {}

  async findProductsById(
    productIds: string[],
  ): Promise<CoreResponse<Product[]>> {
    const productsDTO = await this.dataSource.findProductsById(productIds);

    try {
      const productsMapped = productsDTO.map((p) => {
        const entity = ProductMapper.toEntity(p);
        if (entity.error) throw entity.error;
        return entity.value;
      });

      return {
        value: productsMapped,
        error: undefined,
      };
    } catch (error) {
      return {
        value: undefined,
        error: error as CoreException,
      };
    }
  }
}
