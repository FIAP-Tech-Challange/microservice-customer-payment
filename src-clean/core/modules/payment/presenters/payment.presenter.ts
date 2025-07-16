import { PaymentDTO } from '../DTOs/payment.dto';
import { Payment } from '../entities/payment.entity';

export class PaymentPresenter {
  static toDto(payment: Payment): PaymentDTO {
    return {
      id: payment.id,
      status: payment.status,
      orderId: payment.orderId,
    };
  }
}
