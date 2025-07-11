import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { ProductMapper } from '../mappers/product.mapper';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Product } from '../entities/product.entity';

export class ProductGateway {
  constructor(private dataSource: DataSource) {}

  async findProductById(id: string): Promise<CoreResponse<Product | null>> {
    const productDTO = await this.dataSource.findProductById(id);
    if (!productDTO) return { error: undefined, value: null };

    const dtoMapper = ProductMapper.toEntity(productDTO);
    if (dtoMapper.error) return { error: dtoMapper.error, value: undefined };

    return { error: undefined, value: dtoMapper.value };
  }

  async save(product: Product): Promise<CoreResponse<undefined>> {
    const productDTO = ProductMapper.toPersistenceDTO(product);
    await this.dataSource.saveProduct(productDTO);
    return { error: undefined, value: undefined };
  }

  async findProductByName(
    name: string,
    storeId: string,
  ): Promise<CoreResponse<Product | null>> {
    const productDTO = await this.dataSource.findProductByNameAndStoreId(
      name,
      storeId,
    );

    if (!productDTO) return { error: undefined, value: null };

    const product = ProductMapper.toEntity(productDTO);

    if (product.error) return { error: product.error, value: undefined };

    return { error: undefined, value: product.value };
  }
}
