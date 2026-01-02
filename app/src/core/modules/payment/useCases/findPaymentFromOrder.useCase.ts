import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { PaymentGateway } from '../gateways/payment.gateway';
import { Payment } from '../entities/payment.entity';
import { CoreResponse } from 'src/common/DTOs/coreResponse';

export class FindPaymentFromOrderUseCase {
  constructor(
    private paymentGateway: PaymentGateway,
  ) {}

  async execute(
    orderId: string,
    storeId: string,
  ): Promise<CoreResponse<Payment>> {
    const payment = await this.paymentGateway.findPaymentByOrderId(orderId);
    if (payment.error) return { error: payment.error, value: undefined };
    if(payment.value?.storeId !== storeId) {
      return {
        error: new ResourceNotFoundException(
          'Store id does not match with payment',
        ),
        value: undefined,
      };
    }

    if (!payment.value)
      return {
        error: new ResourceNotFoundException(
          'Payment not found for this order',
        ),
        value: undefined,
      };

    return { error: undefined, value: payment.value };
  }
}
