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
import { getAllOrdersUseCase } from '../useCases/getAllOrders.useCase';
import { getFilteredAndSortedOrdersUseCase } from '../useCases/getFilteredAndSortedOrders.useCase';
import { setOrderToCanceledUseCase } from '../useCases/setOrderToCanceled.useCase';
import { setOrderToFinishedUseCase } from '../useCases/setOrderToFinished.useCase';
import { setOrderToReadyUseCase } from '../useCases/setOrderToReady.useCase';
import { setOrderToReceivedUseCase } from '../useCases/setOrderToReceived.useCase';
import { setOrderToInProgressUseCase } from '../useCases/setOrderToInProgress.useCase';
import { OrderPaginationDto } from 'src-clean/external/consumers/NestAPI/modules/order/dtos/order-pagination.dto';
import { OrderSortedListDto } from 'src-clean/external/consumers/NestAPI/modules/order/dtos/order-sorted-list.dto';

export class OrderCoreController {
  constructor(private dataSource: DataSource) {}

  async createOrder(
    dto: CreateOrderDto,
  ): Promise<CoreResponse<OrderResponseDto | undefined>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const useCase = new SaveOrderUseCase(gateway);
      const { error, value: order } = await useCase.execute(dto);

      if (error || !order) {
        return { error: error, value: undefined };
      }
      const orderPresenter = OrderPresenter.toDto(order);
      return { error: undefined, value: orderPresenter };
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

  async deleteOrderItem(
    orderItemId: string,
  ): Promise<CoreResponse<OrderResponseDto | undefined>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const useCase = new DeleteOrderItemUseCase(gateway);

      const { error, value: order } = await useCase.execute(orderItemId);

      if (error || !order) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: OrderPresenter.toDto(order) };
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
      const useCase = new getAllOrdersUseCase(gateway);

      const { error: orderError, value: orders } = await useCase.execute(
        page,
        limit,
        status,
        storeId,
      );

      if (orderError || !orders) {
        return { error: orderError, value: undefined };
      }
      const data = orders.data.map((order) => OrderPresenter.toDto(order));

      const orderPaginationDto: OrderPaginationDto = {
        data,
        total: orders.total,
        page: orders.page,
        limit: orders.limit,
        totalPages: orders.totalPages,
        hasNextPage: orders.hasNextPage,
        hasPreviousPage: orders.hasPreviousPage,
      };

      return { error: undefined, value: orderPaginationDto };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while getting all orders.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async getFilteredAndSortedOrders(
    storeId: string,
  ): Promise<CoreResponse<OrderSortedListDto>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const useCase = new getFilteredAndSortedOrdersUseCase(gateway);

      const { error: orderError, value: orders } =
        await useCase.execute(storeId);

      if (orderError) {
        return { error: orderError, value: undefined };
      }

      const orderSortedListDto: OrderSortedListDto = {
        total: orders.total,
        data: orders.data.map((order) => OrderPresenter.toDto(order)),
      };
      return { error: undefined, value: orderSortedListDto };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while getting all orders.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async setOrderToCanceled(
    orderId: string,
    storeId: string,
  ): Promise<CoreResponse<void>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const findOrderUseCase = new FindOrderByIdUseCase(gateway);
      const useCase = new setOrderToCanceledUseCase(gateway, findOrderUseCase);

      const { error } = await useCase.execute(orderId, storeId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while setting order to canceled.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async setOrderToFinished(
    orderId: string,
    storeId: string,
  ): Promise<CoreResponse<void>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const findOrderUseCase = new FindOrderByIdUseCase(gateway);
      const useCase = new setOrderToFinishedUseCase(gateway, findOrderUseCase);

      const { error } = await useCase.execute(orderId, storeId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while setting order to finished.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async setOrderToReady(
    orderId: string,
    storeId: string,
  ): Promise<CoreResponse<void>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const findOrderUseCase = new FindOrderByIdUseCase(gateway);
      const useCase = new setOrderToReadyUseCase(gateway, findOrderUseCase);

      const { error } = await useCase.execute(orderId, storeId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while setting order to ready.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async setOrderToReceived(
    orderId: string,
    storeId: string,
  ): Promise<CoreResponse<void>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const findOrderUseCase = new FindOrderByIdUseCase(gateway);
      const useCase = new setOrderToReceivedUseCase(gateway, findOrderUseCase);

      const { error } = await useCase.execute(orderId, storeId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while setting order to received.. ${error}`,
        ),
        value: undefined,
      };
    }
  }

  async setOrderToInProgress(
    orderId: string,
    storeId: string,
  ): Promise<CoreResponse<void>> {
    try {
      const gateway = new OrderGateway(this.dataSource);
      const findOrderUseCase = new FindOrderByIdUseCase(gateway);
      const useCase = new setOrderToInProgressUseCase(
        gateway,
        findOrderUseCase,
      );

      const { error } = await useCase.execute(orderId, storeId);

      if (error) {
        return { error: error, value: undefined };
      }

      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while setting order to in progress.. ${error}`,
        ),
        value: undefined,
      };
    }
  }
}
