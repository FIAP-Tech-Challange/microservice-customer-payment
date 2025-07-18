import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { OrderPaginationDto } from '../DTOs/order-pagination.dto';

export class getAllOrdersUseCase {
  constructor(private orderGateway: OrderGateway) {}

  async execute(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<CoreResponse<OrderPaginationDto>> {
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
