import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Order } from '../entities/order.entity';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { OrderGateway } from '../gateways/order.gateway';

export class FindOrderByIdUseCase {
  constructor(private orderGateway: OrderGateway) {}

  async execute(orderId: string): Promise<CoreResponse<Order>> {
    const { error, value: order } =
      await this.orderGateway.findOrderById(orderId);

    if (error) return { error, value: undefined };
    if (!order) {
      return {
        error: new ResourceNotFoundException('Order not found'),
        value: undefined,
      };
    }
    return { error: undefined, value: order };
  }
}
