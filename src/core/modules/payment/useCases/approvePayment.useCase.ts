import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';
import { FindPaymentByIdUseCase } from './findPaymentById.useCase';
import { SetOrderToReceivedUseCase } from '../../order/useCases/setOrderToReceived.useCase';

export class ApprovePaymentUseCase {
  constructor(
    private paymentGateway: PaymentGateway,
    private findPaymentByIdUseCase: FindPaymentByIdUseCase,
    private setOrderToReceivedUseCase: SetOrderToReceivedUseCase,
  ) {}

  async execute(paymentId: string): Promise<CoreResponse<Payment>> {
    const payment = await this.findPaymentByIdUseCase.execute(paymentId);
    if (payment.error) return { error: payment.error, value: undefined };

    const paymentApproval = payment.value.approve();
    if (paymentApproval.error)
      return {
        error: paymentApproval.error,
        value: undefined,
      };

    await this.paymentGateway.save(payment.value);

    await this.setOrderToReceivedUseCase.execute(
      payment.value.orderId,
      payment.value.storeId,
    );

    return { error: undefined, value: payment.value };
  }
}
