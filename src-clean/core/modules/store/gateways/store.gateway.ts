import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreMapper } from '../mappers/store.mapper';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Store } from '../entities/store.entity';

export class StoreGateway {
  constructor(private dataSource: DataSource) {}

  async findStoreByEmail(email: string): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreByEmail(email);

    if (!storeDTO) return { error: undefined, value: null };

    const { error: mapErr, value: dto } = StoreMapper.toEntity(storeDTO);

    if (mapErr) return { error: mapErr, value: undefined };

    return { error: undefined, value: dto };
  }

  async findStoreByCnpj(cnpj: string): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreByCnpj(cnpj);

    if (!storeDTO) return { error: undefined, value: null };

    const { error: mapErr, value: dto } = StoreMapper.toEntity(storeDTO);

    if (mapErr) return { error: mapErr, value: undefined };

    return { error: undefined, value: dto };
  }

  async findStoreByName(name: string): Promise<CoreResponse<Store | null>> {
    const storeDTO = await this.dataSource.findStoreByName(name);

    if (!storeDTO) return { error: undefined, value: null };

    const { error: mapErr, value: dto } = StoreMapper.toEntity(storeDTO);

    if (mapErr) return { error: mapErr, value: undefined };

    return { error: undefined, value: dto };
  }

  async saveStore(store: Store): Promise<CoreResponse<undefined>> {
    const storeDTO = StoreMapper.toPersistenceDTO(store);
    await this.dataSource.saveStore(storeDTO);
    return { error: undefined, value: undefined };
  }
}
