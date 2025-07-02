import { PaymentDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentDataSource.dto';

export interface PaymentDataSource {
  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null>;
}
