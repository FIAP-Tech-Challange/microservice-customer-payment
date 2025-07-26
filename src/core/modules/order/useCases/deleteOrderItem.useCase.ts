import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { OrderGateway } from '../gateways/order.gateway';
import { Order } from '../entities/order.entity';

export class DeleteOrderItemUseCase {
  constructor(private orderGateway: OrderGateway) {}

  async execute(orderItem: string): Promise<CoreResponse<Order | undefined>> {
    const { error: findError, value: order } =
      await this.orderGateway.findByOrderItemId(orderItem);

    if (findError) return { error: findError, value: undefined };

    if (!order) {
      return {
        error: new ResourceNotFoundException('Order not found'),
        value: undefined,
      };
    }

    const { error: errorItem, value: orderItemRemoved } =
      order.removeItem(orderItem);

    if (errorItem || !orderItemRemoved) {
      return { error: errorItem, value: undefined };
    }

    const { error: deleteError } =
      await this.orderGateway.deleteOrderItem(orderItem);
    if (deleteError) return { error: deleteError, value: undefined };

    const { error: saveError, value: orderSaved } =
      await this.orderGateway.saveOrder(order);
    if (saveError) {
      return { error: saveError, value: undefined };
    }

    return { error: undefined, value: orderSaved };
  }
}
