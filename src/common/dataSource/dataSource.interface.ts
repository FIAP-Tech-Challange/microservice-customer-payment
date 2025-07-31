import { StoreDataSourceDTO } from './DTOs/storeDataSource.dto';
import { CategoryDataSourceDTO } from './DTOs/categoryDataSource.dto';
import { CustomerDataSourceDTO } from './DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from './DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from './DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from './DTOs/paginatedDataSourceResponse.dto';
import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { PaymentCreateExternalDataSourceResponseDTO } from './DTOs/paymentCreateExternalDataSourceResponse.dto';
import { PaymentExternalDataSourceDTO } from './DTOs/paymentExternalDataSource.dto';
import { OrderDataSourceDto } from './DTOs/orderDataSource.dto';
import { OrderPaginationDto } from 'src/core/modules/order/DTOs/order-pagination.dto';
import { NotificationDataSourceDTO } from './DTOs/notificationDataSource.dto';
import { OrderFilteredDto } from 'src/core/modules/order/DTOs/order-filtered.dto';
import { ProductDataSourceDTO } from './DTOs/productDataSource.dto';

export interface DataSource {
  // Store/totem
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
  createPaymentExternal(
    paymentDTO: PaymentExternalDataSourceDTO,
  ): Promise<PaymentCreateExternalDataSourceResponseDTO>;

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
  getFilteredAndSortedOrders(storeId: string): Promise<OrderFilteredDto>;

  // Notification
  sendSMSNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }>;
  sendWhatsappNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }>;
  sendEmailNotification(
    email: string,
    message: string,
  ): Promise<{ error?: string }>;
  sendMonitorNotification(
    ip: string,
    message: string,
  ): Promise<{ error?: string }>;
  saveNotification(notification: NotificationDataSourceDTO): Promise<void>;
}
