import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';
import { FindPaymentByIdUseCase } from './findPaymentById.useCase';
import { CoreException } from 'src-clean/common/exceptions/coreException';

export class ApprovePaymentUseCase {
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
      await this.paymentGateway.approvePaymentExternal(payment.value);
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
    const paymentApproval = payment.value.approve();
    if (paymentApproval.error)
      return {
        error: paymentApproval.error,
        value: undefined,
      };

    return { error: undefined, value: payment.value };
  }
}
