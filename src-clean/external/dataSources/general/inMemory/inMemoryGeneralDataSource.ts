import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from '../general.dataSource';

export class InMemoryGeneralDataSource implements GeneralDataSource {
  private stores: Map<string, StoreDataSourceDTO> = new Map();

  constructor() {}

  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      if (store.email === email) return Promise.resolve(store);
    }

    return Promise.resolve(null);
  }
}
