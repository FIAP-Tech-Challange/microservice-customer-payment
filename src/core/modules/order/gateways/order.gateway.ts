import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { OrderMapper } from '../mappers/order.mapper';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Order } from '../entities/order.entity';
import { OrderPageDto } from '../DTOs/order-page.dto';
import { OrderSortedListDto } from '../DTOs/order-sorted-list.dto';

export class OrderGateway {
  constructor(private dataSource: DataSource) {}

  async saveOrder(order: Order): Promise<CoreResponse<Order | undefined>> {
    const orderDTO = OrderMapper.toPersistenceDTO(order);

    const orderSaved = await this.dataSource.saveOrder(orderDTO);
    const orderMapper = OrderMapper.toEntity(orderSaved);
    if (orderMapper?.error) {
      return { error: orderMapper.error, value: undefined };
    }
    return { error: undefined, value: orderMapper.value };
  }

  async findOrderById(id: string): Promise<CoreResponse<Order | null>> {
    const orderDTO = await this.dataSource.findOrderById(id);
    if (!orderDTO) return { error: undefined, value: null };

    const dtoMapper = OrderMapper.toEntity(orderDTO);
    if (dtoMapper.error) return { error: dtoMapper.error, value: undefined };

    return { error: undefined, value: dtoMapper.value };
  }

  async findByOrderItemId(id: string): Promise<CoreResponse<Order | null>> {
    const orderItemDto = await this.dataSource.findByOrderItemId(id);
    if (!orderItemDto) return { error: undefined, value: null };

    const dtoMapper = OrderMapper.toEntity(orderItemDto);
    if (dtoMapper.error) return { error: dtoMapper.error, value: undefined };

    return { error: undefined, value: dtoMapper.value };
  }

  async deleteOrder(order: Order): Promise<CoreResponse<void>> {
    const orderDTO = OrderMapper.toPersistenceDTO(order);
    await this.dataSource.deleteOrder(orderDTO);
    return { error: undefined, value: undefined };
  }

  async deleteOrderItem(orderItem: string): Promise<CoreResponse<void>> {
    await this.dataSource.deleteOrderItem(orderItem);
    return { error: undefined, value: undefined };
  }

  async getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<CoreResponse<OrderPageDto>> {
    const result = await this.dataSource.getAllOrders(
      page,
      limit,
      status,
      storeId,
    );
    if (!result || result.data.length === 0) {
      return {
        error: undefined,
        value: {
          data: [],
          hasNextPage: false,
          hasPreviousPage: false,
          limit: 0,
          page: 0,
          total: 0,
          totalPages: 0,
        },
      };
    }
    const orderPageDto = result.data
      .map((order) => OrderMapper.toEntity(order).value)
      .filter((order): order is Order => order !== undefined);

    const orderPaginationDto: OrderPageDto = {
      data: orderPageDto,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
      limit: result.limit,
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    };
    return { error: undefined, value: orderPaginationDto };
  }

  async getFilteredAndSortedOrders(
    storeId: string,
  ): Promise<CoreResponse<OrderSortedListDto>> {
    const result = await this.dataSource.getFilteredAndSortedOrders(storeId);

    const orders = result.data
      .map((order) => OrderMapper.toEntity(order).value)
      .filter((order): order is Order => order !== undefined);

    const orderSortedListDto: OrderSortedListDto = {
      total: orders.length,
      data: orders,
    };

    return { error: undefined, value: orderSortedListDto };
  }
}
