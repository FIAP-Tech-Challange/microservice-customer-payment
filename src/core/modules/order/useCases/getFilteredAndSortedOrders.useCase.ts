import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { OrderSortedListDto } from '../DTOs/order-sorted-list.dto';

export class getFilteredAndSortedOrdersUseCase {
  constructor(private orderGateway: OrderGateway) {}

  async execute(storeId: string): Promise<CoreResponse<OrderSortedListDto>> {
    const { error, value: orders } =
      await this.orderGateway.getFilteredAndSortedOrders(storeId);

    if (error) return { error, value: undefined };

    return { error: undefined, value: orders };
  }
}
