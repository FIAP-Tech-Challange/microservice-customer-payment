import { StoreModel } from '../models/domain/store.model';

export interface StoresRepository {
  findByEmail(email: string): Promise<StoreModel | null>;
  findByCnpj(cnpj: string): Promise<StoreModel | null>;
  findById(id: string): Promise<StoreModel | null>;
  create(store: StoreModel): Promise<void>;
}
