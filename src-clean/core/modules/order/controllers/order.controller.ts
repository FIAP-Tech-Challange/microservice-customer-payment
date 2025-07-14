import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { OrderGateway } from '../gateways/order.gateway';
import { SaveOrderUseCase } from '../useCases/saveOrder.useCase';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CreateOrderDto } from '../DTOs/create-order.dto';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import { OrderPresenter } from '../presenters/order.presenter';
import { OrderResponseDto } from '../DTOs/order-response.dto';
import { FindOrderByIdUseCase } from '../useCases/findOrderById.useCase';
import { DeleteOrderUseCase } from '../useCases/deleteOrder.useCase';
import { DeleteOrderItemUseCase } from '../useCases/deleteOrderItem.useCase';
import { OrderPaginationDto } from '../DTOs/order-pagination.dto';

export class OrderController {
  constructor(private dataSource: DataSource) {}

  async createOrder(
    dto: CreateOrderDto,
  ): Promise<CoreResponse<OrderResponseDto>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const useCase = new SaveOrderUseCase(gateway);

      const { error, value: order } = await useCase.execute(dto);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: OrderPresenter.toDto(order!) };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while creating order.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async findOrderById(
    orderId: string,
  ): Promise<CoreResponse<OrderResponseDto>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const useCase = new FindOrderByIdUseCase(gateway);

      const { error, value: order } = await useCase.execute(orderId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: OrderPresenter.toDto(order) };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while finding order.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async deleteOrder(orderId: string): Promise<CoreResponse<undefined>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const useCase = new DeleteOrderUseCase(gateway);

      const { error } = await useCase.execute(orderId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while deleting order.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async deleteOrderItem(orderItemId: string): Promise<CoreResponse<void>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const useCase = new DeleteOrderItemUseCase(gateway);

      const { error } = await useCase.execute(orderItemId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while deleting order item.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async findByOrderItemId(
    orderItemId: string,
  ): Promise<CoreResponse<OrderResponseDto | null>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const useCase = new FindOrderByIdUseCase(gateway);

      const { error, value: order } = await useCase.execute(orderItemId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: OrderPresenter.toDto(order) };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while finding order by item ID.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<CoreResponse<OrderPaginationDto>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const { error: orderError, value: orders } = await gateway.getAllOrders(
        page,
        limit,
        status,
        storeId,
      );

      if (orderError) {
        return { error: orderError, value: undefined };
      }

      return { error: undefined, value: orders };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while getting all orders.. ${error}`,
        ),
        value: undefined,
      };
    }
  }
}
