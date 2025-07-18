import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { OrderMapper } from '../mappers/order.mapper';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Order } from '../entities/order.entity';
import { OrderPaginationDto } from '../DTOs/order-pagination.dto';
import { OrderFilteredDto } from '../DTOs/order-filtered.dto';

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
  ): Promise<CoreResponse<OrderPaginationDto>> {
    const result = await this.dataSource.getAllOrders(
      page,
      limit,
      status,
      storeId,
    );
    return { error: undefined, value: result };
  }

  async getFilteredAndSortedOrders(
    storeId: string,
  ): Promise<CoreResponse<OrderFilteredDto>> {
    const result = await this.dataSource.getFilteredAndSortedOrders(storeId);
    return { error: undefined, value: result };
  }
}
