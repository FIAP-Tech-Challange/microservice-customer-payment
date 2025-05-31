import { OrderItemModel } from '../domain/order-item.model';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import { OrderItemEntity } from '../entities/order-item.entity';

export class OrderItemMapper {
  static toDomain(entity: OrderItemEntity): OrderItemModel {
    return OrderItemModel.restore({
      id: entity.id,
      productId: entity.product_id,
      unitPrice: entity.unit_price,
      quantity: entity.quantity,
      createdAt: entity.created_at,
    });
  }

  static toEntity(model: OrderItemModel, orderId: string): OrderItemEntity {
    return OrderItemEntity.create({
      id: model.id,
      order_id: orderId,
      product_id: model.productId,
      unit_price: model.unitPrice,
      subtotal: model.subtotal,
      quantity: model.quantity,
      created_at: model.createdAt,
    });
  }

  static toResponseDto(model: OrderItemModel): OrderItemResponseDto {
    return {
      id: model.id,
      productId: model.productId,
      unitPrice: model.unitPrice,
      quantity: model.quantity,
      totalPrice: model.subtotal,
      createdAt: model.createdAt,
    };
  }
}
