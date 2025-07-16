import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Order } from './../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderDataSourceDto } from 'src-clean/common/dataSource/DTOs/orderDataSource.dto';
import { OrderItemMapper } from './order-item.mapper';
import { CoreException } from 'src-clean/common/exceptions/coreException';
import { OrderStatusEnum } from 'src/modules/order/models/enum/order-status.enum';

export class OrderMapper {
  static toEntity(dto: OrderDataSourceDto): CoreResponse<Order> {
    const orderItems: OrderItem[] = [];

    try {
      dto.order_items.forEach((item) => {
        const { error, value } = OrderItemMapper.toEntity(item);

        if (error) throw error;

        orderItems.push(value);
      });
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }

    return Order.restore({
      id: dto.id,
      customer: dto.customer_id ?? null,
      status: dto.status as OrderStatusEnum,
      storeId: dto.store_id,
      totemId: dto.totem_id ?? undefined,
      orderItems: orderItems,
      createdAt: new Date(dto.created_at),
    });
  }

  static toPersistenceDTO(entity: Order): OrderDataSourceDto {
    return {
      id: entity.id,
      customer_id: entity.customer ?? null,
      status: entity.status,
      store_id: entity.storeId,
      total_price: entity.totalPrice,
      totem_id: entity.totemId ?? null,
      created_at: entity.createdAt.toISOString(),
      order_items: entity.orderItems.map((item) =>
        OrderItemMapper.toPersistenceDTO(item),
      ),
    };
  }
}
