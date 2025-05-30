import {
  RequestFromStore,
  RequestFromTotem,
} from 'src/modules/auth/models/dtos/request.dto';
import { OrderModel } from '../../models/domain/order.model';
import { CreateOrderDto } from '../../models/dto/create-order.dto';
import { OrderIdDto } from '../../models/dto/order-id.dto';
import { OrderPaginationDto } from '../../models/dto/order-pagination.dto';
import { OrderRequestParamsDto } from '../../models/dto/order-request-params.dto';
import { UpdateOrderStatusDto } from '../../models/dto/update-order-status.dto';

export interface OrderInputPort {
  create(
    createOrderDto: CreateOrderDto,
    req: RequestFromTotem,
  ): Promise<OrderModel>;
  findById(id: OrderIdDto, req: RequestFromStore): Promise<OrderModel>;
  getAll(
    params: OrderRequestParamsDto,
    req: RequestFromStore,
  ): Promise<OrderPaginationDto>;
  updateStatus(
    id: OrderIdDto,
    status: UpdateOrderStatusDto,
    req: RequestFromStore,
  ): Promise<OrderModel>;
  delete(id: OrderIdDto, req: RequestFromStore): Promise<void>;
  deleteOrderItem(
    orderItemId: string,
    req: RequestFromStore,
  ): Promise<OrderModel | void>;
  updateCustomerId(
    id: string,
    customerId: string,
    req: RequestFromStore,
  ): Promise<OrderModel>;
}
