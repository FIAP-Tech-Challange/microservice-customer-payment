import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { StoreDataSourceDTO } from './DTOs/storeDataSource.dto';
import { CategoryDataSourceDTO } from './DTOs/categoryDataSource.dto';
import { TotemDataSourceDTO } from './DTOs/totemDataSource.dto';
import { CustomerDataSourceDTO } from './DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from './DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from './DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from './DTOs/paginatedDataSourceResponse.dto';
import { OrderDataSourceDto } from './DTOs/orderDataSource.dto';
import { OrderPaginationDto } from 'src-clean/core/modules/order/DTOs/order-pagination.dto';
import { ProductDataSourceDTO } from './DTOs/productDataSource.dto';

export interface DataSource {
  // Totem
  findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null>;

  // Store
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null>;
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null>;
  findStoreById(id: string): Promise<StoreDataSourceDTO | null>;
  saveStore(store: StoreDataSourceDTO): Promise<void>;

  // Product/Category
  saveCategory(categoryDTO: CategoryDataSourceDTO): Promise<void>;
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null>;
  findCategoryByNameAndStoreId(
    name: string,
    storeId: string,
  ): Promise<CategoryDataSourceDTO | null>;

  // Payment
  findProductById(id: string): Promise<ProductDataSourceDTO | null>;
  saveProduct(product: ProductDataSourceDTO): Promise<void>;
  findProductByName(
    name: string,
  ): ProductDataSourceDTO | PromiseLike<ProductDataSourceDTO | null> | null;
  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null>;

  // Customer
  findCustomerById(id: string): Promise<CustomerDataSourceDTO | null>;
  findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null>;
  findCustomerByEmail(email: string): Promise<CustomerDataSourceDTO | null>;
  findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>>;
  saveCustomer(customer: CustomerDataSourceDTO): Promise<void>;
  deleteCustomer(id: string): Promise<void>;
  
  // Order
  saveOrder(order: OrderDataSourceDto): Promise<void>;
  findOrderById(id: string): Promise<OrderDataSourceDto | null>;
  findByOrderItemId(id: string): Promise<OrderDataSourceDto | null>;
  deleteOrder(order: OrderDataSourceDto): Promise<void>;
  deleteOrderItem(orderItem: string): Promise<void>;
  getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<OrderPaginationDto>;
}
