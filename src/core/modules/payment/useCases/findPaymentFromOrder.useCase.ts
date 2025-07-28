import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { FindOrderByIdUseCase } from '../../order/useCases/findOrderById.useCase';
import { PaymentGateway } from '../gateways/payment.gateway';
import { Payment } from '../entities/payment.entity';
import { CoreResponse } from 'src/common/DTOs/coreResponse';

export class FindPaymentFromOrderUseCase {
  constructor(
    private paymentGateway: PaymentGateway,
    private findOrderByIdUseCase: FindOrderByIdUseCase,
  ) {}

  async execute(
    orderId: string,
    storeId: string,
  ): Promise<CoreResponse<Payment>> {
    const findOrder = await this.findOrderByIdUseCase.execute(orderId);
    if (findOrder.error) return { error: findOrder.error, value: undefined };

    const order = findOrder.value;
    if (order.storeId !== storeId) {
      return {
        error: new ResourceNotFoundException(
          'Order not found or does not belong to the store',
        ),
        value: undefined,
      };
    }

    const payment = await this.paymentGateway.findPaymentByOrderId(order.id);
    if (payment.error) return { error: payment.error, value: undefined };

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
