import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Payment } from '../entities/payment.entity';
import { PaymentGateway } from '../gateways/payment.gateway';
import { FindStoreByIdUseCase } from '../../store/useCases/findStoreById.useCase';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

export class findPaymentByIdUseCase {
  constructor(
    private paymentGateway: PaymentGateway,
    private findStoreByIdUseCase: FindStoreByIdUseCase,
  ) {}

  async execute(
    paymentId: string,
    storeId: string,
  ): Promise<CoreResponse<Payment>> {
    const store = await this.findStoreByIdUseCase.execute(storeId);
    if (store.error) return { error: store.error, value: undefined };

    const payment = await this.paymentGateway.findPaymentById(paymentId);
    if (payment.error) return { error: payment.error, value: undefined };

    if (!payment.value)
      return {
        error: new ResourceNotFoundException('Payment not found'),
        value: undefined,
      };

    if (payment.value.storeId !== storeId)
      return {
        error: new ResourceNotFoundException('Payment not found'),
        value: undefined,
      };

    return { error: undefined, value: payment.value };
  }
}
