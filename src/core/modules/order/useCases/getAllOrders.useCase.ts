import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { OrderPageDto } from '../DTOs/order-page.dto';

export class getAllOrdersUseCase {
  constructor(private orderGateway: OrderGateway) {}

  async execute(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<CoreResponse<OrderPageDto>> {
    const { error, value: orders } = await this.orderGateway.getAllOrders(
      page,
      limit,
      status,
      storeId,
    );

    if (error) return { error, value: undefined };
    return { error: undefined, value: orders };
  }
}
