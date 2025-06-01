import { Email } from 'src/shared/domain/email.vo';
import { StoreModel } from '../../models/domain/store.model';
import { CNPJ } from '../../models/domain/cnpj.vo';

export interface StoresRepositoryPort {
  findByEmail(email: Email): Promise<StoreModel | null>;
  findByCnpj(cnpj: CNPJ): Promise<StoreModel | null>;
  findById(id: string): Promise<StoreModel | null>;
  save(store: StoreModel): Promise<void>;
  findByTotemAccessToken(tokenAccess: string): Promise<StoreModel | null>;
}

export const STORE_REPOSITORY_PORT_KEY = Symbol('StoresRepositoryPort');
