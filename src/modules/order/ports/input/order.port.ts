import { OrderModel } from '../../models/domain/order.model';
import { CreateOrderDto } from '../../models/dto/create-order.dto';
import { OrderIdDto } from '../../models/dto/order-id.dto';
import { OrderPaginationDto } from '../../models/dto/order-pagination.dto';
import { OrderRequestParamsDto } from '../../models/dto/order-request-params.dto';
import { UpdateOrderStatusDto } from '../../models/dto/update-order-status.dto';

export interface OrderInputPort {
  create(createOrderDto: CreateOrderDto): Promise<OrderModel>;
  findById(id: OrderIdDto): Promise<OrderModel>;
  getAll(params: OrderRequestParamsDto): Promise<OrderPaginationDto>;
  updateStatus(
    id: OrderIdDto,
    status: UpdateOrderStatusDto,
  ): Promise<OrderModel>;
  delete(id: OrderIdDto): Promise<void>;
  deleteOrderItem(orderItemId: string): Promise<OrderModel | void>;
  updateCustomerId(id: string, customerId: string): Promise<OrderModel>;
}
