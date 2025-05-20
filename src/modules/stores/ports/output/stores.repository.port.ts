import { StoreModel } from '../../models/domain/store.model';

export interface StoresRepositoryPort {
  findByEmail(email: string): Promise<StoreModel | null>;
  findByCnpj(cnpj: string): Promise<StoreModel | null>;
  findById(id: string): Promise<StoreModel | null>;
  create(store: StoreModel): Promise<void>;
}

export const STORE_REPOSITORY_PORT_KEY = Symbol('StoresRepositoryPort');
