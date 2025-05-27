import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
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
import { CustomerService } from '../../customers/services/customer.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepositoryPort: OrderRepositoryPort,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
  ) {}

  create(dto: CreateOrderDto): Promise<OrderModel> {
    const order = OrderModel.create({
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
      orderCurrent.status === (OrderStatusEnum.RECEIVED as string) ||
      orderCurrent.status === (OrderStatusEnum.IN_PROGRESS as string)
    ) {
      return this.orderRepositoryPort.updateStatus(id, status);
    } else {
      throw new BadRequestException(`Order with id ${id} cannot be updated`);
    }
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
  }

  async updateCustomerId(
    orderId: string,
    customerId: string,
  ): Promise<OrderModel> {
    this.logger.log(`Updating customer ID for order ${orderId}`);

    // Get the customer data to associate
    const customer = await this.customerService.findById(customerId);
    if (!customer) {
      this.logger.error(`Customer with ID ${customerId} not found`);
      throw new BadRequestException(`Customer with ID ${customerId} not found`);
    }

    // Find order
    const order = await this.orderRepositoryPort.findById(orderId);
    if (!order) {
      this.logger.error(`Order with id ${orderId} not found`);
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    // Check if order already has a customer associated
    if (order.customer) {
      this.logger.error(
        `Order ${orderId} already has a customer associated (${order.customer.id})`,
      );
      throw new BadRequestException(`Order already has a customer associated`);
    }

    // Check if order status is CANCELED or FINISHED
    if (
      (order.status as OrderStatusEnum) === OrderStatusEnum.CANCELED ||
      (order.status as OrderStatusEnum) === OrderStatusEnum.FINISHED
    ) {
      this.logger.error(
        `Cannot update customer ID for order ${orderId} with status ${getStatusName(order.status as OrderStatusEnum)}`,
      );
      throw new BadRequestException(
        `Cannot update customer ID for order with status ${getStatusName(order.status as OrderStatusEnum)}`,
      );
    }

    // Update customer data
    order.customer = {
      id: customer.id,
      cpf: customer.cpf,
      name: customer.name,
      email: customer.email,
    };

    const updatedOrder = await this.orderRepositoryPort.updateOrder(order);
    if (!updatedOrder) {
      this.logger.error(`Failed to update customer ID for order ${orderId}`);
      throw new BadRequestException(
        `Failed to update customer ID for order ${orderId}`,
      );
    }

    this.logger.log(`Customer ID updated successfully for order ${orderId}`);
    return updatedOrder;
  }
}
