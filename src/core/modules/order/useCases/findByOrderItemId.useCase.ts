import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { Order } from '../entities/order.entity';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

export class FindByOrderItemId {
  constructor(private orderGateway: OrderGateway) {}

  async execute(orderItemId: string): Promise<CoreResponse<Order | null>> {
    const { error, value: order } =
      await this.orderGateway.findByOrderItemId(orderItemId);

    if (error) return { error, value: undefined };
    if (!order)
      return {
        error: new ResourceNotFoundException('Order not found'),
        value: undefined,
      };

    return { error: undefined, value: order };
  }
}
