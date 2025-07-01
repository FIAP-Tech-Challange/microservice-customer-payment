import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { StoreDataSourceDTO } from './DTOs/storeDataSource.dto';

export interface DataSource {
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null>;
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null>;
  findStoreById(id: string): Promise<StoreDataSourceDTO | null>;
  saveStore(store: StoreDataSourceDTO): Promise<void>;

  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null>;
}
