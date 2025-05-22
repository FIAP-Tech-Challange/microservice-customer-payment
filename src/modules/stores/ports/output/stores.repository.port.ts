import { StoreModel } from '../../models/domain/store.model';

export interface StoresRepositoryPort {
  findByEmail(email: string): Promise<StoreModel | null>;
  findByCnpj(cnpj: string): Promise<StoreModel | null>;
  findById(id: string): Promise<StoreModel | null>;
  save(store: StoreModel): Promise<void>;
  findByTotemAccessToken(tokenAccess: string): Promise<StoreModel | null>;
}

export const STORE_REPOSITORY_PORT_KEY = Symbol('StoresRepositoryPort');
