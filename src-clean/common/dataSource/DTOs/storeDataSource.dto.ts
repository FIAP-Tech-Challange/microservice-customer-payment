import { TotemDataSourceDTO } from './totemDataSource.dto';

export interface StoreDataSourceDTO {
  id: string;
  cnpj: string;
  email: string;
  name: string;
  fantasy_name: string;
  phone: string;
  salt: string;
  password_hash: string;
  created_at: string;
  totems: TotemDataSourceDTO[];
}
