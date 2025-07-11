import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from '../general.dataSource';
import { TotemDataSourceDTO } from 'src-clean/common/dataSource/DTOs/totemDataSource.dto';

export class InMemoryGeneralDataSource implements GeneralDataSource {
  private stores: Map<string, StoreDataSourceDTO> = new Map();

  constructor() {}

  findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      for (const totem of store.totems) {
        if (totem.token_access === accessToken) return Promise.resolve(totem);
      }
    }

    return Promise.resolve(null);
  }

  findStoreById(id: string): Promise<StoreDataSourceDTO | null> {
    return Promise.resolve(this.stores.get(id) || null);
  }

  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      if (store.cnpj === cnpj) return Promise.resolve(store);
    }

    return Promise.resolve(null);
  }

  findStoreByName(name: string): Promise<StoreDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      if (store.name === name) return Promise.resolve(store);
    }

    return Promise.resolve(null);
  }

  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      if (store.email === email) return Promise.resolve(store);
    }

    return Promise.resolve(null);
  }

  saveStore(store: StoreDataSourceDTO): Promise<void> {
    this.stores.set(store.id, store);
    return Promise.resolve();
  }
}
