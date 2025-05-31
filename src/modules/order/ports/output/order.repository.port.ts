import { OrderItemModel } from '../../models/domain/order-item.model';
import { OrderModel } from '../../models/domain/order.model';
import { OrderPaginationDomainDto } from '../../models/dto/order-pagination-domain.dto';
import { OrderStatusEnum } from '../../models/enum/order-status.enum';

export interface OrderRepositoryPort {
  save(order: OrderModel): Promise<void>;
  delete(order: OrderModel): Promise<void>;
  deleteOrderItem(orderItem: OrderItemModel, orderId: string): Promise<void>;

  getAll(
    page: number,
    limit: number,
    status: OrderStatusEnum,
    storeId: string,
  ): Promise<OrderPaginationDomainDto>;
  findById(id: string): Promise<OrderModel | null>;
  findByOrderItemId(orderItemId: string): Promise<OrderModel | null>;
}
