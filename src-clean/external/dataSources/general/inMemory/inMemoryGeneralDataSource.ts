import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from '../general.dataSource';
import { OrderDataSourceDto } from 'src-clean/common/dataSource/DTOs/orderDataSource.dto';
import { OrderDataSourcePaginationDto } from 'src-clean/common/dataSource/DTOs/orderDataSourcePagination.dto';
import { TotemDataSourceDTO } from 'src-clean/common/dataSource/DTOs/totemDataSource.dto';
import { CategoryDataSourceDTO } from 'src-clean/common/dataSource/DTOs/categoryDataSource.dto';
import { CustomerDataSourceDTO } from 'src-clean/common/dataSource/DTOs/customerDataSource.dto';
import { PaginatedDataSourceParamsDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src-clean/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceResponseDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceResponse.dto';

export class InMemoryGeneralDataSource implements GeneralDataSource {
  private stores: Map<string, StoreDataSourceDTO> = new Map();
  private orders: Map<string, OrderDataSourceDto> = new Map();
  private productCategories: Map<string, CategoryDataSourceDTO> = new Map();
  private customers: Map<string, CustomerDataSourceDTO> = new Map();

  constructor() {}
  // Order
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


  // Totem
  findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null> {
    for (const store of this.stores.values()) {
      for (const totem of store.totems) {
        if (totem.token_access === accessToken) return Promise.resolve(totem);
      }
    }

    return Promise.resolve(null);
  }

  // Store
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

  // Product/Category
  saveCategory(categoryDTO: CategoryDataSourceDTO): Promise<void> {
    this.productCategories.set(categoryDTO.id, categoryDTO);
    return Promise.resolve();
  }
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null> {
    return Promise.resolve(this.productCategories.get(id) || null);
  }
  findCategoryByNameAndStoreId(
    name: string,
    storeId: string,
  ): Promise<CategoryDataSourceDTO | null> {
    for (const category of this.productCategories.values()) {
      if (category.name === name && category.store_id === storeId)
        return Promise.resolve(category);
    }

    return Promise.resolve(null);
  }

  // Customer
  findCustomerById(id: string): Promise<CustomerDataSourceDTO | null> {
    return Promise.resolve(this.customers.get(id) || null);
  }
  findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null> {
    for (const customer of this.customers.values()) {
      if (customer.cpf === cpf) return Promise.resolve(customer);
    }

    return Promise.resolve(null);
  }
  findCustomerByEmail(email: string): Promise<CustomerDataSourceDTO | null> {
    for (const customer of this.customers.values()) {
      if (customer.email === email) return Promise.resolve(customer);
    }

    return Promise.resolve(null);
  }
  findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>> {
    const customers = Array.from(this.customers.values());

    const filteredCustomers = customers.filter((customer) => {
      if (filters.cpf && customer.cpf !== filters.cpf) return false;
      if (filters.name && !customer.name.includes(filters.name)) return false;
      if (filters.email && customer.email !== filters.email) return false;
      return true;
    });

    const paginatedCustomers = filteredCustomers.slice(
      (paginatedParams.page - 1) * paginatedParams.limit,
      paginatedParams.page * paginatedParams.limit,
    );

    return Promise.resolve({
      data: paginatedCustomers,
      total: filteredCustomers.length,
      page: paginatedParams.page,
      limit: paginatedParams.limit,
      totalPages: Math.ceil(filteredCustomers.length / paginatedParams.limit),
    });
  }
  saveCustomer(customer: CustomerDataSourceDTO): Promise<void> {
    this.customers.set(customer.id, customer);
    return Promise.resolve();
  }
  deleteCustomer(id: string): Promise<void> {
    this.customers.delete(id);
    return Promise.resolve();
  }
}
