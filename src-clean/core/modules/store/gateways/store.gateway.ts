import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreMapper } from '../mappers/store.mapper';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Store } from '../entities/store.entity';

export class StoreGateway {
  constructor(private dataSource: DataSource) {}

  async findStoreByEmail(email: string): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreByEmail(email);

    if (!storeDTO) return [undefined, null];

    const [mapErr, dto] = StoreMapper.toEntity(storeDTO);

    if (mapErr) return [mapErr, undefined];

    return [undefined, dto];
  }

  async findStoreByCnpj(cnpj: string): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreByCnpj(cnpj);

    if (!storeDTO) return [undefined, null];

    const [mapErr, dto] = StoreMapper.toEntity(storeDTO);

    if (mapErr) return [mapErr, undefined];

    return [undefined, dto];
  }

  async findStoreByName(name: string): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreByName(name);

    if (!storeDTO) return [undefined, null];

    const [mapErr, dto] = StoreMapper.toEntity(storeDTO);

    if (mapErr) return [mapErr, undefined];

    return [undefined, dto];
  }

  async saveStore(store: Store): Promise<CoreResponse<undefined>> {
    try {
      const storeDTO = StoreMapper.toPersistenceDTO(store);
      await this.dataSource.saveStore(storeDTO);
      return [undefined, undefined];
    } catch (error) {
      return [error, undefined];
    }
  }
}
