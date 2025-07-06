import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { ProductMapper } from '../mappers/product.mapper';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Product } from '../entities/product.entity';
import { ProductDataSourceDTO } from 'src-clean/common/dataSource/DTOs/productDataSource.dto';

export class ProductGateway {
  save(product: Product): { error: any; value: any; } | PromiseLike<{ error: any; value: any; }> {
      throw new Error('Method not implemented.');
  }
  findProductByNameAndStoreId(name: string, storeId: any): { error: any; value: any; } | PromiseLike<{ error: any; value: any; }> {
      throw new Error('Method not implemented.');
  }
  constructor(private dataSource: DataSource) {}

  async findProductById(id: string): Promise<CoreResponse<Product | null>> {
    const productDTO = await this.dataSource.findProductById(id) as ProductDataSourceDTO | null;
    if (!productDTO) return { error: undefined, value: null };

    const dtoMapper = ProductMapper.toEntity(productDTO);
    if (dtoMapper.error) return { error: dtoMapper.error, value: undefined };

    return { error: undefined, value: dtoMapper.value };
  }

  async saveProduct(product: Product): Promise<CoreResponse<undefined>> {
    const productDTO = ProductMapper.toPersistenceDTO(product);
    await this.dataSource.saveProduct(productDTO);
    return { error: undefined, value: undefined };
  }

  async findProductByName(name: string): Promise<CoreResponse<Product | null>> {
    const productDTO = await this.dataSource.findProductByName(name) as ProductDataSourceDTO | null;

    if (!productDTO) return { error: undefined, value: null };

    const { error: mapErr, value: dto } = ProductMapper.toEntity(productDTO);

    if (mapErr) return { error: mapErr, value: undefined };

    return { error: undefined, value: dto };
  }
}