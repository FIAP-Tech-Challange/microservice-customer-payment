import { InjectRepository } from '@nestjs/typeorm';
import { OrderModel } from '../../models/domain/order.model';
import { OrderStatusEnum } from '../../models/enum/order-status.enum';
import { OrderRepositoryPort } from '../../ports/output/order.repository.port';
import { OrderEntity } from '../../models/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderMapper } from '../../models/mapper/order.mapper';
import { OrderItemEntity } from '../../models/entities/order-item.entity';
import { Injectable } from '@nestjs/common';
import { OrderItemModel } from '../../models/domain/order-item.model';
import { OrderItemMapper } from '../../models/mapper/order-item.mapper';

@Injectable()
export class OrderRepositoryTypeORM implements OrderRepositoryPort {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async save(order: OrderModel): Promise<void> {
    await this.orderRepository.save(OrderMapper.toEntity(order));
  }

  async delete(order: OrderModel): Promise<void> {
    const orderEntity = OrderMapper.toEntity(order);
    await this.orderRepository.remove(orderEntity);
  }

  async deleteOrderItem(
    orderItem: OrderItemModel,
    orderId: string,
  ): Promise<void> {
    const orderItemEntity = OrderItemMapper.toEntity(orderItem, orderId);
    await this.orderItemRepository.remove(orderItemEntity);
  }

  async getAll(
    page: number,
    limit: number,
    status: OrderStatusEnum,
    storeId: string,
  ): Promise<any> {
    const orders = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        store_id: storeId,
        ...(status ? { status } : {}),
      },
      relations: ['order_items', 'customer'],
      order: { created_at: 'DESC' },
    });

    if (!orders || orders[0].length === 0) {
      return [];
    }
    const orderModels = orders[0].map((order) => OrderMapper.toDomain(order));

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

    return order ? OrderMapper.toDomain(order) : null;
  }

  async findByOrderItemId(orderItemId: string): Promise<OrderModel | null> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id: orderItemId },
      relations: ['order', 'order.customer'],
    });

    return orderItem ? OrderMapper.toDomain(orderItem.order) : null;
  }
}
