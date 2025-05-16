import { Store } from '../entities/store.entity';

export interface StoreRepository {
  findByCnpj(cnpj: string): Promise<Store | null>;
  create(store: Store): Promise<void>;
  findById(id: string): Promise<Store | null>;
}
