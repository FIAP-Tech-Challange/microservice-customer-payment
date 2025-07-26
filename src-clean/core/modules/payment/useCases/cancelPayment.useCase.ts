import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';
import { FindPaymentByIdUseCase } from './findPaymentById.useCase';
import { CoreException } from 'src-clean/common/exceptions/coreException';

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

    try {
      await this.paymentGateway.rejectPaymentOnExternal(payment.value);
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }

    const paymentRejection = payment.value.reject();
    if (paymentRejection.error)
      return {
        error: paymentRejection.error,
        value: undefined,
      };

    return { error: undefined, value: payment.value };
  }
}
