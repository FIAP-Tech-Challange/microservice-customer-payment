import { InitiatePaymentResponseDTO } from '../DTOs/initiatePaymentResponse.dto';
import { PaymentDTO } from '../DTOs/payment.dto';
import { Payment } from '../entities/payment.entity';

export class PaymentPresenter {
  static toDto(payment: Payment): PaymentDTO {
    return {
      id: payment.id,
      status: payment.status,
      orderId: payment.orderId,
      externalId: payment.externalId!,
      total: payment.total,
      qrCode: payment.qrCode!,
      platform: payment.platform!,
      paymentType: payment.paymentType,
      storeId: payment.storeId,
    };
  }

  static toInitiatePaymentResponseDTO(
    payment: Payment,
  ): InitiatePaymentResponseDTO {
    return {
      id: payment.id,
      orderId: payment.orderId,
      externalId: payment.externalId!,
      platform: payment.platform!,
      qrCode: payment.qrCode!,
    };
  }
}
