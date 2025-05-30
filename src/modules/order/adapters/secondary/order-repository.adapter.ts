import { InjectRepository } from '@nestjs/typeorm';
import { OrderModel } from '../../models/domain/order.model';
import { OrderStatusEnum } from '../../models/enum/order-status.enum';
import { OrderRepositoryPort } from '../../ports/output/order.repository';
import { OrderEntity } from '../../models/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderMapper } from '../../models/mapper/order.mapper';
import { OrderItemEntity } from '../../models/entities/order-item.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class OrderRepositoryAdapter implements OrderRepositoryPort {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async saveOrder(order: OrderModel): Promise<OrderModel> {
    if (!order.orderItems) {
      throw new NotFoundException('Order items are required');
    }
    const orderEntity = OrderMapper.toEntity(order);
    const orderItemsEntity = OrderMapper.toEntityItem(order.orderItems);

    if (!orderItemsEntity || orderItemsEntity.length === 0) {
      throw new NotFoundException('Order items are required');
    }

    const orderSavedWithItems = this.orderRepository.create({
      ...orderEntity,
      order_items: orderItemsEntity,
    });

    const orderSaved = await this.orderRepository.save(orderSavedWithItems);

    return OrderMapper.toDomain(orderSaved, orderSaved.order_items);
  }

  async getAll(
    page: number,
    limit: number,
    status: OrderStatusEnum,
    storeId: string,
  ): Promise<any> {
    const params = {
      store_id: storeId,
      status: status,
    };
    const orders = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: params,
      relations: ['order_items', 'customer'],
      order: { created_at: 'DESC' },
    });

    if (!orders || orders[0].length === 0) {
      return [];
    }
    const orderModels = orders[0].map((order) =>
      OrderMapper.toDomain(order, order.order_items),
    );

    return {
      data: orderModels,
      total: orders[1],
      page,
      limit,
      totalPages: Math.ceil(orders[1] / limit),
      hasNextPage: page * limit < orders[1],
      hasPreviousPage: page > 1,
    };
  }

  async findById(id: string): Promise<OrderModel | null> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['order_items', 'customer'],
    });
    if (order) {
      return OrderMapper.toDomain(order, order.order_items);
    }
    return null;
  }

  async updateStatus(
    id: string,
    status: OrderStatusEnum,
  ): Promise<OrderModel | null> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['order_items', 'customer'],
    });

    if (!order) {
      return null;
    }

    order.status = status;
    const orderUpdate = await this.orderRepository.save(order);
    return OrderMapper.toDomain(orderUpdate, orderUpdate.order_items);
  }

  async updateOrder(order: Partial<OrderModel>): Promise<OrderModel | null> {
    const orderSaved = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['order_items', 'customer'],
    });

    if (!orderSaved) {
      return null;
    }

    if (order.customer) {
      orderSaved.customer_id = order.customer.id;
    }

    if (order.totalPrice) {
      const total = orderSaved.order_items.reduce(
        (acc, item) => acc + item.subtotal,
        0,
      );
      if (total !== order.totalPrice) {
        throw new BadRequestException(
          `Total price ${order.totalPrice} does not match the sum of order items ${total}`,
        );
      }
      orderSaved.total_price = order.totalPrice;
    }

    const orderUpdate = await this.orderRepository.save(orderSaved);
    return OrderMapper.toDomain(orderUpdate, orderUpdate.order_items);
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async findOrderItem(orderItemId: string): Promise<OrderModel | null> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
      relations: ['order', 'order.customer'],
    });
    if (!orderItem) {
      return null;
    }
    return OrderMapper.toDomain(orderItem.order, [orderItem]);
  }

  async deleteOrderItem(orderItemId: string): Promise<void> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
      relations: ['order'],
    });

    if (!orderItem) {
      throw new NotFoundException(
        `Order item with id ${orderItemId} not found`,
      );
    }

    await this.orderItemRepository.delete(orderItemId);
  }
}
