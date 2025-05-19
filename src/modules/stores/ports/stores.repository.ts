import { Store } from '../entities/store.entity';

export interface StoresRepository {
  findByEmail(email: string): Promise<Store | null>;
  findByCnpj(cnpj: string): Promise<Store | null>;
  findById(id: string): Promise<Store | null>;
  create(store: Store): Promise<void>;
}
