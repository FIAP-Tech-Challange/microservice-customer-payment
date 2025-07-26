import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

export class DeleteOrderUseCase {
  constructor(private orderGateway: OrderGateway) {}

  async execute(orderId: string): Promise<CoreResponse<undefined>> {
    const { error: findError, value: order } =
      await this.orderGateway.findOrderById(orderId);
    if (findError) return { error: findError, value: undefined };
    if (!order) {
      return {
        error: new ResourceNotFoundException('Order not found'),
        value: undefined,
      };
    }

    const { error: deleteError } = await this.orderGateway.deleteOrder(order);
    if (deleteError) return { error: deleteError, value: undefined };

    return { error: undefined, value: undefined };
  }
}
