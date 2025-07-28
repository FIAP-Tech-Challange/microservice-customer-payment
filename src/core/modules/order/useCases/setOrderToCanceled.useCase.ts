import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { CoreException } from 'src/common/exceptions/coreException';
import { FindOrderByIdUseCase } from './findOrderById.useCase';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

export class SetOrderToCanceledUseCase {
  constructor(
    private orderGateway: OrderGateway,
    private findOrderByIdUseCase: FindOrderByIdUseCase,
  ) {}

  async execute(orderId: string, storeId: string): Promise<CoreResponse<void>> {
    const { error: orderError, value: order } =
      await this.findOrderByIdUseCase.execute(orderId);

    if (orderError) return { error: orderError, value: undefined };

    if (order.storeId !== storeId) {
      return {
        error: new ResourceNotFoundException(
          'Order not found or does not belong to the store',
        ),
        value: undefined,
      };
    }

    try {
      order.setToCanceled();
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
