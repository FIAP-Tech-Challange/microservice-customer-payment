import { PaymentModel } from '../../models/domain/payment.model';
import { PaymentStatusEnum } from '../../models/enum/payment-status.enum';

export interface PaymentRepositoryPort {
  savePayment(payment: PaymentModel): Promise<PaymentModel>;
  findById(id: string): Promise<PaymentModel>;
  updateStatus(
    id: string,
    status: PaymentStatusEnum,
  ): Promise<PaymentModel | null>;
}
