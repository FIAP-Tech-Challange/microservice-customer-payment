import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { CoreException } from 'src/common/exceptions/coreException';
import { FindOrderByIdUseCase } from './findOrderById.useCase';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { FindPaymentFromOrderUseCase } from '../../payment/useCases/findPaymentFromOrder.useCase';
import { PaymentStatusEnum } from '../../payment/enums/paymentStatus.enum';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';

export class SetOrderToReceivedUseCase {
  constructor(
    private orderGateway: OrderGateway,
    private findOrderByIdUseCase: FindOrderByIdUseCase,
    private findPaymentByOrderIdUseCase: FindPaymentFromOrderUseCase,
  ) {}

  async execute(orderId: string, storeId: string): Promise<CoreResponse<void>> {
    try {
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

      order.setToReceived();

      const findPayment = await this.findPaymentByOrderIdUseCase.execute(
        orderId,
        storeId,
      );
      if (findPayment.error)
        return { error: findPayment.error, value: undefined };

      if (findPayment.value.status !== PaymentStatusEnum.APPROVED)
        return {
          error: new ResourceConflictException(
            'Cannot set order to received because payment is not approved',
          ),
          value: undefined,
        };

      const { error: saveError } = await this.orderGateway.saveOrder(order);
      if (saveError) return { error: saveError, value: undefined };
      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: error as CoreException,
        value: undefined,
      };
    }
  }
}
