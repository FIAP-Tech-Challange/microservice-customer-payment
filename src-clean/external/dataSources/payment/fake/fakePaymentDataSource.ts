import { PaymentDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentDataSource.dto';
import { PaymentDataSource } from '../payment.dataSource';

export class FakePaymentDataSource implements PaymentDataSource {
  private payments: Map<string, PaymentDataSourceDTO> = new Map();

  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null> {
    const payment = this.payments.get(paymentId);

    return Promise.resolve(payment || null);
  }
}
