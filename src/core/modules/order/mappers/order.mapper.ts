import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Order, OrderStatusEnum } from './../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderDataSourceDto } from 'src/common/dataSource/DTOs/orderDataSource.dto';
import { OrderItemMapper } from './order-item.mapper';
import { CoreException } from 'src/common/exceptions/coreException';
import { Customer } from '../../customer/entities/customer.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';

export class OrderMapper {
  static toEntity(dto: OrderDataSourceDto): CoreResponse<Order> {
    const orderItems: OrderItem[] = [];
    let customer: Customer | undefined = undefined;

    if (dto.customer) {
      customer = Customer.restore({
        id: dto.customer.id,
        cpf: CPF.create(dto.customer.cpf)?.value as CPF,
        name: dto.customer.name,
        email: Email.create(dto.customer.email)?.value as Email,
        createdAt: new Date(dto.customer.createdAt),
        updatedAt: new Date(dto.customer.updatedAt),
      }).value;
    }

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
      customer: customer,
      customerId: dto.customer_id ?? undefined,
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
      customer_id: entity.customer?.id ?? null,
      status: entity.status,
      store_id: entity.storeId,
      total_price: entity.totalPrice,
      totem_id: entity.totemId ?? null,
      created_at: entity.createdAt,
      order_items: entity.orderItems.map((item) =>
        OrderItemMapper.toPersistenceDTO(item, entity.id),
      ),
    };
  }
}
