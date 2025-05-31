import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { OrderRepositoryPort } from '../ports/output/order.repository.port';
import { ORDER_REPOSITORY_PORT } from '../order.tokens';
import { OrderModel } from '../models/domain/order.model';
import { CreateOrderDto } from '../models/dto/create-order.dto';
import { OrderItemModel } from '../models/domain/order-item.model';
import { OrderStatusEnum } from '../models/enum/order-status.enum';
import { OrderRequestParamsDto } from '../models/dto/order-request-params.dto';
import { getStatusName } from '../util/status-order.util';
import { CustomerService } from '../../customers/services/customer.service';
import { OrderPaginationDomainDto } from '../models/dto/order-pagination-domain.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepositoryPort: OrderRepositoryPort,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
  ) {}

  async create(
    dto: CreateOrderDto,
    storeId: string,
    totemId: string | undefined,
  ): Promise<OrderModel> {
    let order: OrderModel;

    try {
      order = OrderModel.create({
        storeId,
        totemId,
        orderItems: dto.orderItems.map((item) =>
          OrderItemModel.create({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }),
        ),
      });
    } catch (error) {
      this.logger.error(`Failed to create order: ${error.message}`);
      throw new BadRequestException('Failed to create order: ' + error.message);
    }

    this.logger.log(
      `Creating order for store ${order.storeId}. Id: ${order.id}, Items: ${order.orderItems.length}`,
    );

    await this.orderRepositoryPort.save(order);

    return order;
  }

  async getAll(
    params: OrderRequestParamsDto,
    storeId: string,
  ): Promise<OrderPaginationDomainDto> {
    this.logger.log('Fetching all orders');
    const paginatedData = await this.orderRepositoryPort.getAll(
      params.page ?? 1,
      params.limit ?? 10,
      params.status ?? OrderStatusEnum.PENDING,
      storeId,
    );
    this.logger.log(`Found ${paginatedData?.total} orders`);
    return paginatedData;
  }

  async findById(id: string, storeId: string): Promise<OrderModel> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    this.logger.log(`Finding order by id ${id}`);
    const order = await this.orderRepositoryPort.findById(id);

    if (!order) {
      this.logger.log(`Order with id ${id} not found`);
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    if (order.storeId !== storeId) {
      this.logger.error(
        `Order with id ${id} does not belong to store ${storeId}`,
      );
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    this.logger.log(`Order with id ${id} found successfully`);
    return order;
  }

  async findByOrderItemId(
    orderItemId: string,
    storeId: string,
  ): Promise<OrderModel> {
    this.logger.log(`Finding order by order item id ${orderItemId}`);

    const order = await this.orderRepositoryPort.findByOrderItemId(orderItemId);

    if (!order) {
      this.logger.error(`Order item with id ${orderItemId} not found`);
      throw new NotFoundException(
        `Order item with id ${orderItemId} not found`,
      );
    }

    if (order.storeId !== storeId) {
      this.logger.error(
        `Order with id ${order.id} does not belong to store ${storeId}`,
      );
      throw new NotFoundException(`Order with id ${order.id} not found`);
    }

    this.logger.log(`Order with id ${order.id} found successfully`);
    return order;
  }

  async updateStatus(
    id: string,
    status: OrderStatusEnum,
    storeId: string,
  ): Promise<OrderModel> {
    this.logger.log(`Updating order ${id} to status ${getStatusName(status)}`);
    const order = await this.findById(id, storeId);

    switch (status) {
      case OrderStatusEnum.CANCELED:
        order.setToCanceled();
        break;
      case OrderStatusEnum.FINISHED:
        order.setToFinished();
        break;
      case OrderStatusEnum.IN_PROGRESS:
        order.setToInProgress();
        break;
      case OrderStatusEnum.READY:
        order.setToReady();
        break;
      case OrderStatusEnum.RECEIVED:
        order.setToReceived();
        break;
      default:
        this.logger.error(`Invalid status: ${status}`);
        throw new BadRequestException(`Invalid status: ${status}`);
    }

    await this.orderRepositoryPort.save(order);

    this.logger.log(
      `Order ${id} updated to status ${getStatusName(status)} successfully`,
    );

    return order;
  }

  async delete(id: string, storeId: string): Promise<void> {
    if (!id) {
      this.logger.error('Id is required for deletion');
      throw new BadRequestException('Id is required for deletion');
    }

    const orderCurrent = await this.findById(id, storeId);

    if (orderCurrent.status !== OrderStatusEnum.PENDING) {
      this.logger.error(
        `Order with id ${id} cannot be deleted, status is not PENDING`,
      );
      throw new BadRequestException(
        `Order with id ${id} cannot be deleted, status is not PENDING`,
      );
    }

    await this.orderRepositoryPort.delete(orderCurrent);
  }

  async deleteOrderItem(
    orderItemId: string,
    storeId: string,
  ): Promise<OrderModel> {
    this.logger.log(`Deleting order item ${orderItemId}`);

    const order = await this.findByOrderItemId(orderItemId, storeId);

    let orderItem: OrderItemModel;

    try {
      orderItem = order.removeItem(orderItemId);
    } catch (error) {
      this.logger.error(`Failed to remove order item: ${error.message}`);
      throw new BadRequestException(
        `Failed to remove order item: ${error.message}`,
      );
    }

    await this.orderRepositoryPort.deleteOrderItem(orderItem, order.id);
    await this.orderRepositoryPort.save(order);

    return order;
  }

  async updateCustomerId(
    orderId: string,
    customerId: string,
    storeId: string,
  ): Promise<OrderModel> {
    this.logger.log(`Updating customer ID for order ${orderId}`);

    const customer = await this.customerService.findById(customerId);
    if (!customer) {
      this.logger.error(`Customer with ID ${customerId} not found`);
      throw new BadRequestException(`Customer with ID ${customerId} not found`);
    }

    const order = await this.findById(orderId, storeId);

    try {
      order.associateCustomer(customer);
    } catch (error) {
      this.logger.error(`Failed to associate customer: ${error.message}`);
      throw new BadRequestException(
        `Failed to associate customer: ${error.message}`,
      );
    }

    await this.orderRepositoryPort.save(order);

    this.logger.log(`Customer ID updated successfully for order ${orderId}`);
    return order;
  }
}
