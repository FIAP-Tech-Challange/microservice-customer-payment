import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';
import { FindPaymentByIdUseCase } from './findPaymentById.useCase';

export class CancelPaymentUseCase {
  constructor(
    private paymentGateway: PaymentGateway,
    private findPaymentByIdUseCase: FindPaymentByIdUseCase,
  ) {}

  async execute(paymentId: string): Promise<CoreResponse<Payment>> {
    const payment = await this.findPaymentByIdUseCase.execute(paymentId);
    if (payment.error) return { error: payment.error, value: undefined };

    const paymentRejection = payment.value.reject();
    if (paymentRejection.error)
      return {
        error: paymentRejection.error,
        value: undefined,
      };

    await this.paymentGateway.save(payment.value);

    return { error: undefined, value: payment.value };
  }
}
