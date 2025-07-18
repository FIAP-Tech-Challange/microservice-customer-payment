import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { OrderFilteredDto } from '../DTOs/order-filtered.dto';

export class getFilteredAndSortedOrdersUseCase {
  constructor(private orderGateway: OrderGateway) {}

  async execute(storeId: string): Promise<CoreResponse<OrderFilteredDto>> {
    const { error, value: orders } =
      await this.orderGateway.getFilteredAndSortedOrders(storeId);

    if (error) return { error, value: undefined };
    return { error: undefined, value: orders };
  }
}
