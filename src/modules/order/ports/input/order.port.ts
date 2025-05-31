import {
  RequestFromStore,
  RequestFromTotem,
} from 'src/modules/auth/models/dtos/request.dto';
import { CreateOrderDto } from '../../models/dto/create-order.dto';
import { OrderPaginationDto } from '../../models/dto/order-pagination.dto';
import { OrderRequestParamsDto } from '../../models/dto/order-request-params.dto';
import { UpdateOrderStatusDto } from '../../models/dto/update-order-status.dto';
import { OrderResponseDto } from '../../models/dto/order-response.dto';

export interface OrderInputPort {
  create(
    createOrderDto: CreateOrderDto,
    req: RequestFromTotem,
  ): Promise<OrderResponseDto>;
  findById(id: string, req: RequestFromStore): Promise<OrderResponseDto>;
  getAll(
    params: OrderRequestParamsDto,
    req: RequestFromStore,
  ): Promise<OrderPaginationDto>;
  updateStatus(
    id: string,
    status: UpdateOrderStatusDto,
    req: RequestFromStore,
  ): Promise<OrderResponseDto>;
  delete(id: string, req: RequestFromStore): Promise<void>;
  deleteOrderItem(
    orderItemId: string,
    req: RequestFromStore,
  ): Promise<OrderResponseDto>;
  updateCustomerId(
    id: string,
    customerId: string,
    req: RequestFromStore,
  ): Promise<OrderResponseDto>;
}
