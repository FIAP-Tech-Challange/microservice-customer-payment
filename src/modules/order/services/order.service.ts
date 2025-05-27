import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepositoryPort } from '../ports/output/order.repository';
import { ORDER_REPOSITORY_PORT } from '../order.tokens';
import { OrderModel } from '../models/domain/order.model';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { OrderItemModel } from '../models/domain/order-item.model';
import { OrderStatusEnum } from '../models/enum/order-status.enum';
import { OrderRequestParamsDto } from '../models/dto/order-request-params.dto';
import { OrderPaginationDto } from '../models/dto/order-pagination.dto';
import { getStatusName } from '../util/status-order.util';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepositoryPort: OrderRepositoryPort,
  ) {}

  create(dto: CreateOrderDto): Promise<OrderModel> {
    const order = OrderModel.create({
      customerId: dto.customerId,
      storeId: dto.storeId,
      totemId: dto.totemId,
    });

    this.logger.log(
      `Creating order for store ${dto.storeId} with id ${order.id}`,
    );

    const orderItems = dto.orderItems.map((item) => {
      return OrderItemModel.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });
    });

    const orderWithItems = OrderModel.addOrderItens(order, orderItems);
    return this.orderRepositoryPort.saveOrder(orderWithItems);
  }

  async getAll(params: OrderRequestParamsDto): Promise<OrderPaginationDto> {
    this.logger.log('Fetching all orders');
    const orders = await this.orderRepositoryPort.getAll(
      params.page ?? 1,
      params.limit ?? 10,
      params.status ?? OrderStatusEnum.PENDING,
    );
    this.logger.log(`Found ${orders?.total} orders`);
    return orders;
  }

  async findById(id: string): Promise<OrderModel> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    this.logger.log(`Finding order by id ${id}`);
    const order = await this.orderRepositoryPort.findById(id);

    if (!order) {
      this.logger.log(`Order with id ${id} not found`);
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    this.logger.log(`Order found successfully`);
    return order;
  }

  async updateStatus(id: string, status: OrderStatusEnum): Promise<any> {
    this.logger.log(`Updating order ${id} to status ${getStatusName(status)}`);
    const orderCurrent = await this.orderRepositoryPort.findById(id);

    if (!orderCurrent) {
      this.logger.error(`order with id ${id} not found`);
      throw new NotFoundException(`order with id ${id} not found`);
    }

    if (
      orderCurrent.status === (OrderStatusEnum.FINISHED as string) ||
      orderCurrent.status === (OrderStatusEnum.CANCELED as string)
    ) {
      throw new BadRequestException(
        `Order with id ${id} cannot be updated, order is CANCELED or FINISHED`,
      );
    }

    return this.orderRepositoryPort.updateStatus(id, status);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting order ${id}`);
    const orderCurrent = await this.orderRepositoryPort.findById(id);

    if (!orderCurrent) {
      this.logger.error(`Order with id ${id} not found`);
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    if (orderCurrent.status !== (OrderStatusEnum.PENDING as string)) {
      this.logger.error(
        `Order with id ${id} cannot be deleted, status is not PENDING`,
      );
      throw new BadRequestException(
        `Order with id ${id} cannot be deleted, status is not PENDING`,
      );
    }

    return this.orderRepositoryPort.delete(id);
  }

  async deleteOrderItem(orderItemId: string): Promise<OrderModel | void> {
    this.logger.log(`Deleting order item ${orderItemId}`);

    const order = await this.orderRepositoryPort.findOrderItem(orderItemId);

    if (!order) {
      this.logger.error(`Order item with id ${orderItemId} not found`);
      throw new NotFoundException(
        `Order item with id ${orderItemId} not found`,
      );
    }

    if (order.status !== (OrderStatusEnum.PENDING as string)) {
      throw new BadRequestException(
        `Order item with id ${orderItemId} cannot be deleted, status is not PENDING`,
      );
    }

    await this.orderRepositoryPort.deleteOrderItem(orderItemId);
    this.logger.log(`Order item ${orderItemId} deleted successfully`);
    const orderCurrent = await this.orderRepositoryPort.findById(order.id);

    if (!orderCurrent) {
      this.logger.error(`Order with id ${order.id} not found`);
      throw new NotFoundException(`Order with id ${order.id} not found`);
    }

    if (!orderCurrent.orderItems || orderCurrent.orderItems?.length === 0) {
      this.logger.log(`No more order items left, deleting order ${order.id}`);
      await this.orderRepositoryPort.delete(orderCurrent.id);
      return;
    }

    order.totalPrice = orderCurrent.orderItems?.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );

    this.logger.log(
      `update total price for order ${order.id} after deleting order item ${orderItemId}`,
    );

    const orderUpdated = await this.orderRepositoryPort.updateOrder(order);
    if (!orderUpdated) {
      this.logger.error(`Order with id ${order.id} not found after deletion`);
      throw new NotFoundException(`Order with id ${order.id} not found`);
    }
    return orderUpdated;
  }
}
