import { Store } from '../entities/store.entity';

export interface StoreRepository {
  findByEmail(email: string): Promise<Store | null>;
  findByCnpj(cnpj: string): Promise<Store | null>;
  create(store: Store): Promise<void>;
}
