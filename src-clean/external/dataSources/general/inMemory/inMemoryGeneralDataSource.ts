import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from '../general.dataSource';
import { OrderDataSourceDto } from 'src-clean/common/dataSource/DTOs/orderDataSource.dto';
import { OrderDataSourcePaginationDto } from 'src-clean/common/dataSource/DTOs/orderDataSourcePagination.dto';

export class InMemoryGeneralDataSource implements GeneralDataSource {
  private stores: Map<string, StoreDataSourceDTO> = new Map();
  private orders: Map<string, OrderDataSourceDto> = new Map();

  constructor() {}

  saveOrder(order: OrderDataSourceDto): Promise<void> {
    this.orders.set(order.id, order);
    return Promise.resolve();
  }
  deleteOrder(order: OrderDataSourceDto): Promise<void> {
    this.orders.delete(order.id);
    return Promise.resolve();
  }
  deleteOrderItem(orderItem: string): Promise<void> {
    for (const order of this.orders.values()) {
      order.order_items = order.order_items.filter(
        (item) => item.id !== orderItem,
      );
    }
    return Promise.resolve();
  }
  getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<OrderDataSourcePaginationDto> {
    const orders = Array.from(this.orders.values()).filter(
      (order) => order.store_id === storeId && order.status === status,
    );

    return Promise.resolve({
      data: orders,
      totalPages: Math.ceil(orders.length / limit),
      total: orders.length,
      page,
      limit,
      hasNextPage: page * limit < orders.length,
      hasPreviousPage: page > 1,
    });
  }
  findOrderById(id: string): Promise<OrderDataSourceDto | null> {
    const order = this.orders.get(id);
    return Promise.resolve(order || null);
  }
  findByOrderItemId(id: string): Promise<OrderDataSourceDto | null> {
    for (const order of this.orders.values()) {
      if (order.order_items.some((item) => item.id === id)) {
        return Promise.resolve(order);
      }
    }
    return Promise.resolve(null);
  }
  findStoreById(id: string): Promise<StoreDataSourceDTO | null> {
    return Promise.resolve(this.stores.get(id) || null);
  }

  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      if (store.cnpj === cnpj) return Promise.resolve(store);
    }

    return Promise.resolve(null);
  }

  findStoreByName(name: string): Promise<StoreDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      if (store.name === name) return Promise.resolve(store);
    }

    return Promise.resolve(null);
  }

  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      if (store.email === email) return Promise.resolve(store);
    }

    return Promise.resolve(null);
  }

  saveStore(store: StoreDataSourceDTO): Promise<void> {
    this.stores.set(store.id, store);
    return Promise.resolve();
  }
}
