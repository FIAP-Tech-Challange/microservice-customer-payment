import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';
import { FindPaymentByIdUseCase } from './findPaymentById.useCase';

export class CancelPaymentUseCase {
  constructor(
    private paymentGateway: PaymentGateway,
    private findPaymentByIdUseCase: FindPaymentByIdUseCase,
  ) {}

  async execute(
    paymentId: string,
    storeId: string,
  ): Promise<CoreResponse<Payment>> {
    const payment = await this.findPaymentByIdUseCase.execute(
      paymentId,
      storeId,
    );
    if (payment.error) return { error: payment.error, value: undefined };

    await this.paymentGateway.rejectPaymentOnExternal(payment.value);

    const paymentRejection = payment.value.reject();
    if (paymentRejection.error)
      return {
        error: paymentRejection.error,
        value: undefined,
      };

    return { error: undefined, value: payment.value };
  }
}
