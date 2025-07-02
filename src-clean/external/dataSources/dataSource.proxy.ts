import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from './general/general.dataSource';
import { PaymentDataSource } from './payment/payment.dataSource';
import { PaymentDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentDataSource.dto';

export class DataSourceProxy implements DataSource {
  constructor(
    private generalDataSource: GeneralDataSource,
    private paymentDataSource: PaymentDataSource,
  ) {}
  findStoreById(id: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreById(id);
  }

  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByCnpj(cnpj);
  }

  findStoreByName(name: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByName(name);
  }

  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null> {
    return this.paymentDataSource.getPayment(paymentId);
  }

  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByEmail(email);
  }

  saveStore(store: StoreDataSourceDTO): Promise<void> {
    return this.generalDataSource.saveStore(store);
  }
}
