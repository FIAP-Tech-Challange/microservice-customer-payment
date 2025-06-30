import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreMapper } from '../mappers/store.mapper';

export class StoreGateway {
  constructor(private dataSource: DataSource) {}

  async findStoreByEmail(email: string) {
    const storeDTO = await this.dataSource.findStoreByEmail(email);

    if (!storeDTO) return null;

    return StoreMapper.toEntity(storeDTO);
  }
}
