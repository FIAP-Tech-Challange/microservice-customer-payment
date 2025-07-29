import { OrderDataSourceDto } from 'src/common/dataSource/DTOs/orderDataSource.dto';
import { OrderDataSourcePaginationDto } from 'src/common/dataSource/DTOs/orderDataSourcePagination.dto';
import { CategoryDataSourceDTO } from 'src/common/dataSource/DTOs/categoryDataSource.dto';
import { CustomerDataSourceDTO } from 'src/common/dataSource/DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { PaymentDataSourceDTO } from 'src/common/dataSource/DTOs/paymentDataSource.dto';
import { StoreDataSourceDTO } from 'src/common/dataSource/DTOs/storeDataSource.dto';
import { OrderFilteredDto } from 'src/core/modules/order/DTOs/order-filtered.dto';
import { ProductDataSourceDTO } from 'src/common/dataSource/DTOs/productDataSource.dto';
import { NotificationDataSourceDTO } from 'src/common/dataSource/DTOs/notificationDataSource.dto';

export interface GeneralDataSource {
  // Store/Totem
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null>;
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null>;
  findStoreById(id: string): Promise<StoreDataSourceDTO | null>;
  saveStore(store: StoreDataSourceDTO): Promise<void>;
  findStoreByTotemAccessToken(
    accessToken: string,
  ): Promise<StoreDataSourceDTO | null>;

  // Product/Category
  findAllCategoriesByStoreId(storeId: string): Promise<CategoryDataSourceDTO[]>;
  saveCategory(categoryDTO: CategoryDataSourceDTO): Promise<void>;
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null>;
  findCategoryByNameAndStoreId(
    name: string,
    storeId: string,
  ): Promise<CategoryDataSourceDTO | null>;
  findProductsById(productIds: string[]): Promise<ProductDataSourceDTO[]>;

  // Payment
  savePayment(paymentDTO: PaymentDataSourceDTO): Promise<void>;
  findPaymentById(paymentId: string): Promise<PaymentDataSourceDTO | null>;
  findPaymentByOrderId(orderId: string): Promise<PaymentDataSourceDTO | null>;

  // Customer
  findCustomerById(id: string): Promise<CustomerDataSourceDTO | null>;
  findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null>;
  findCustomerByEmail(email: string): Promise<CustomerDataSourceDTO | null>;
  findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>>;
  saveCustomer(customer: CustomerDataSourceDTO): Promise<void>;

  // Order
  saveOrder(order: OrderDataSourceDto): Promise<OrderDataSourceDto>;
  deleteOrder(order: OrderDataSourceDto): Promise<void>;
  deleteOrderItem(orderItem: string): Promise<void>;
  getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<OrderDataSourcePaginationDto>;
  findOrderById(id: string): Promise<OrderDataSourceDto | null>;
  findByOrderItemId(id: string): Promise<OrderDataSourceDto | null>;
  getFilteredAndSortedOrders(storeId: string): Promise<OrderFilteredDto>;

  // Notification
  saveNotification(notification: NotificationDataSourceDTO): Promise<void>;
}
