import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

export class FindPaymentByIdUseCase {
  constructor(private paymentGateway: PaymentGateway) {}

  async execute(paymentId: string): Promise<CoreResponse<Payment>> {
    const payment = await this.paymentGateway.findPaymentById(paymentId);
    if (payment.error) return { error: payment.error, value: undefined };

    if (!payment.value)
      return {
        error: new ResourceNotFoundException('Payment not found'),
        value: undefined,
      };

    return { error: undefined, value: payment.value };
  }
}
