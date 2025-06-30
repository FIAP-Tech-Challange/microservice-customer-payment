import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { StoreDataSourceDTO } from './DTOs/storeDataSource.dto';

export interface DataSource {
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null>;
}
