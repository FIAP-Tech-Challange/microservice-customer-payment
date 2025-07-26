import { OrderItemResponseDto } from '../DTOs/order-item-response.dto';
import { OrderItem } from '../entities/order-item.entity';

export class OrderItemPresenter {
  static toDto(orderItem: OrderItem): OrderItemResponseDto {
    return {
      id: orderItem.id,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      unitPrice: orderItem.unitPrice,
      totalPrice: orderItem.quantity * orderItem.unitPrice,
      createdAt: orderItem.createdAt,
    };
  }
}
