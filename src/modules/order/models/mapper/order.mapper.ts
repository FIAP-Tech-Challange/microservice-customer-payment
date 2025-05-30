import { CustomerMapper } from 'src/modules/customers/models/customer.mapper';
import { OrderModel } from '../domain/order.model';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemMapper } from './order-item.mapper';

export class OrderMapper {
  static toDomain(entity: OrderEntity): OrderModel {
    return OrderModel.restore({
      id: entity.id,
      customer: entity.customer
        ? CustomerMapper.toDomain(entity.customer)
        : undefined,
      status: entity.status,
      storeId: entity.store_id,
      totemId: entity.totem_id ?? undefined,
      createdAt: entity.created_at,
      orderItems: entity.order_items.map((item) =>
        OrderItemMapper.toDomain(item),
      ),
    });
  }

  static toEntity(model: OrderModel): OrderEntity {
    return OrderEntity.create({
      id: model.id,
      customer_id: model.customer?.id ?? null,
      customer: model.customer ? CustomerMapper.toEntity(model.customer) : null,
      status: model.status,
      total_price: model.totalPrice,
      store_id: model.storeId,
      totem_id: model.totemId ?? null,
      created_at: model.createdAt,
      order_items: model.orderItems.map((item) =>
        OrderItemMapper.toEntity(item, model.id),
      ),
    });
  }
}
