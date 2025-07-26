import { OrderItemDataSourceDTO } from 'src/common/dataSource/DTOs/orderItemDataSource.dto';
import { OrderItem } from '../entities/order-item.entity';
import { CoreResponse } from 'src/common/DTOs/coreResponse';

export class OrderItemMapper {
  static toEntity(dto: OrderItemDataSourceDTO): CoreResponse<OrderItem> {
    return OrderItem.restore({
      id: dto.id,
      productId: dto.product_id,
      unitPrice: Number(dto.unit_price),
      quantity: Number(dto.quantity),
      createdAt: new Date(dto.created_at),
    });
  }

  static toPersistenceDTO(
    entity: OrderItem,
    orderId: string,
  ): OrderItemDataSourceDTO {
    return {
      id: entity.id,
      order_id: orderId,
      subtotal: entity.subtotal,
      product_id: entity.productId,
      unit_price: entity.unitPrice,
      quantity: entity.quantity,
      created_at: entity.createdAt,
    };
  }
}
