import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { OrderGateway } from '../gateways/order.gateway';
import { SaveOrderUseCase } from '../useCases/saveOrder.useCase';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CreateOrderDto } from '../DTOs/create-order.dto';
import { UnexpectedError } from 'src/common/exceptions/unexpectedError';
import { OrderPresenter } from '../presenters/order.presenter';
import { OrderResponseDto } from '../DTOs/order-response.dto';
import { FindOrderByIdUseCase } from '../useCases/findOrderById.useCase';
import { DeleteOrderUseCase } from '../useCases/deleteOrder.useCase';
import { DeleteOrderItemUseCase } from '../useCases/deleteOrderItem.useCase';
import { getAllOrdersUseCase } from '../useCases/getAllOrders.useCase';
import { getFilteredAndSortedOrdersUseCase } from '../useCases/getFilteredAndSortedOrders.useCase';
import { SetOrderToCanceledUseCase } from '../useCases/setOrderToCanceled.useCase';
import { setOrderToFinishedUseCase } from '../useCases/setOrderToFinished.useCase';
import { setOrderToReadyUseCase } from '../useCases/setOrderToReady.useCase';
import { setOrderToInProgressUseCase } from '../useCases/setOrderToInProgress.useCase';
import { OrderPaginationDto } from 'src/external/consumers/NestAPI/modules/order/dtos/order-pagination.dto';
import { OrderSortedListDto } from 'src/external/consumers/NestAPI/modules/order/dtos/order-sorted-list.dto';
import { ProductGateway } from '../../product/gateways/product.gateway';
import { FindProductsByIdUseCase } from '../../product/useCases/findProductsById.useCase';
import { CustomerGateway } from '../../customer/gateways/customer.gateway';
import { FindCustomerByIdUseCase } from '../../customer/useCases/findCustomerById.useCase';
import { LinkCustomerToOrderUseCase } from '../useCases/linkCustomerToOrder.useCase';

export class OrderCoreController {
  constructor(private dataSource: DataSource) {}

  async createOrder(
    dto: CreateOrderDto,
  ): Promise<CoreResponse<OrderResponseDto | undefined>> {
    try {
      const orderGateway = new OrderGateway(this.dataSource);
      const productGateway = new ProductGateway(this.dataSource);
      const findProductsByIdUseCase = new FindProductsByIdUseCase(
        productGateway,
      );
      const useCase = new SaveOrderUseCase(
        orderGateway,
        findProductsByIdUseCase,
      );
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
      const useCase = new SetOrderToCanceledUseCase(gateway, findOrderUseCase);

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

  async linkCustomerToOrder(
    orderId: string,
    customerId: string,
    storeId: string,
  ): Promise<CoreResponse<OrderResponseDto>> {
    try {
      const orderGateway = new OrderGateway(this.dataSource);
      const findCustomerByIdUseCase = new FindCustomerByIdUseCase(
        new CustomerGateway(this.dataSource),
      );
      const linkCustomerToOrderUseCase = new LinkCustomerToOrderUseCase(
        orderGateway,
        findCustomerByIdUseCase,
      );

      const { error: err, value: order } =
        await linkCustomerToOrderUseCase.execute(orderId, customerId, storeId);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: OrderPresenter.toDto(order) };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while linking customer to order ${error.message}`,
        ),
        value: undefined,
      };
    }
  }
}
