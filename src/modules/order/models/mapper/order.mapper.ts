import { OrderItemModel } from '../domain/order-item.model';
import { OrderModel } from '../domain/order.model';
import { CustomerInOrderModel } from '../domain/customer.model';
import { OrderItemEntity } from '../entities/order-item.entity';
import { OrderEntity } from '../entities/order.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';

export class OrderMapper {
  static toDomain(
    entity: OrderEntity,
    entityItem: OrderItemEntity[],
  ): OrderModel {
    let orderItems: OrderItemModel[] | undefined = undefined;
    if (entityItem?.length > 0) {
      orderItems = entityItem?.map((item) =>
        OrderItemModel.fromProps({
          id: item.id,
          orderId: item.order_id,
          productId: item.product_id,
          unitPrice: parseFloat(item.unit_price.toFixed(2)),
          quantity: item.quantity,
          subtotal: parseFloat(item.subtotal.toFixed(2)),
          createdAt: item.created_at,
        }),
      );
    }

    // Create customer object if available
    let customerObj: CustomerInOrderModel | undefined = undefined;
    if (entity.customer) {
      customerObj = {
        id: entity.customer.id,
        cpf: entity.customer.cpf,
        name: entity.customer.name,
        email: entity.customer.email,
      };
    }

    return OrderModel.fromProps({
      id: entity.id,
      customer: customerObj,
      status: entity.status as OrderStatusEnum,
      totalPrice: parseFloat(entity.total_price.toFixed(2)),
      storeId: entity.store_id,
      totemId: entity.totem_id ?? undefined,
      orderItems: orderItems,
      createdAt: entity.created_at,
    });
  }

  static toEntity(model: OrderModel): OrderEntity {
    const entity = new OrderEntity();
    entity.id = model.id;
    entity.customer_id = model.customer?.id ?? null;
    entity.status = model.status;
    entity.total_price = model.totalPrice ?? 0;
    entity.store_id = model.storeId;
    entity.totem_id = model.totemId ?? null;
    entity.created_at = model.createdAt;

    return entity;
  }

  static toEntityItem(model: OrderItemModel[]): OrderItemEntity[] {
    const entityItems = model.map((item) => {
      const entityItem = new OrderItemEntity();
      entityItem.id = item.id;
      entityItem.order_id = item.orderId;
      entityItem.product_id = item.productId;
      entityItem.unit_price = item.unitPrice;
      entityItem.quantity = item.quantity;
      entityItem.subtotal = item.subtotal;
      entityItem.created_at = item.createdAt;

      return entityItem;
    });

    return entityItems;
  }
}
