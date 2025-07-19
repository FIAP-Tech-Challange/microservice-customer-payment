import { OrderResponseDto } from '../DTOs/order-response.dto';
import { Order } from '../entities/order.entity';
import { OrderItemPresenter } from './order-item.presenter';

export class OrderPresenter {
  static toDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      customerId: order.customer,
      status: order.status,
      totalPrice: order.totalPrice,
      storeId: order.storeId,
      totemId: order.totemId,
      createdAt: order.createdAt,
      orderItems: order.orderItems.map((item) =>
        OrderItemPresenter.toDto(item),
      ),
    };
  }
}
