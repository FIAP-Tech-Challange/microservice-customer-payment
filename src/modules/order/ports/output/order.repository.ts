import { OrderModel } from '../../models/domain/order.model';
import { OrderPaginationDto } from '../../models/dto/order-pagination.dto';
import { OrderStatusEnum } from '../../models/enum/order-status.enum';

export interface OrderRepositoryPort {
  saveOrder(order: OrderModel): Promise<OrderModel>;
  getAll(
    page: number,
    limit: number,
    status: OrderStatusEnum,
    storeId: string,
  ): Promise<OrderPaginationDto>;
  findById(id: string): Promise<OrderModel | null>;
  updateStatus(id: string, status: OrderStatusEnum): Promise<OrderModel | null>;
  updateOrder(order: Partial<OrderModel>): Promise<OrderModel | null>;
  delete(id: string): Promise<void>;
  findOrderItem(orderItemId: string): Promise<OrderModel | null>;
  deleteOrderItem(orderItemId: string): Promise<void>;
}
