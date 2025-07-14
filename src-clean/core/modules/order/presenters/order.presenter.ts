import { OrderResponseDto } from '../DTOs/order-response.dto';
import { Order } from '../entities/order.entity';
import { OrderItemPresenter } from './order-item.presenter';

export class OrderPresenter {
  static toDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      customer: order.customer,
      status: order.status,
      totalPrice: order.totalPrice,
      storeId: order.storeId,
      totemId: order.totemId,
      orderItems: order.orderItems.map((item) =>
        OrderItemPresenter.toDto(item),
      ),
      createdAt: order.createdAt,
    };
  }
}
