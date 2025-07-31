import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { StoreDataSourceDTO } from 'src/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from './general/general.dataSource';
import { PaymentDataSource } from './payment/payment.dataSource';
import { PaymentDataSourceDTO } from 'src/common/dataSource/DTOs/paymentDataSource.dto';
import { OrderDataSourceDto } from 'src/common/dataSource/DTOs/orderDataSource.dto';
import { OrderDataSourcePaginationDto } from 'src/common/dataSource/DTOs/orderDataSourcePagination.dto';
import { CustomerDataSourceDTO } from 'src/common/dataSource/DTOs/customerDataSource.dto';
import { PaginatedDataSourceParamsDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceResponseDTO } from 'src/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { CategoryDataSourceDTO } from 'src/common/dataSource/DTOs/categoryDataSource.dto';
import { PaymentCreateExternalDataSourceResponseDTO } from 'src/common/dataSource/DTOs/paymentCreateExternalDataSourceResponse.dto';
import { PaymentExternalDataSourceDTO } from 'src/common/dataSource/DTOs/paymentExternalDataSource.dto';
import { OrderFilteredDto } from 'src/core/modules/order/DTOs/order-filtered.dto';
import { ProductDataSourceDTO } from 'src/common/dataSource/DTOs/productDataSource.dto';
import { NotificationDataSourceDTO } from 'src/common/dataSource/DTOs/notificationDataSource.dto';
import { NotificationDataSource } from './notification/notification.dataSource';

export class DataSourceProxy implements DataSource {
  constructor(
    private generalDataSource: GeneralDataSource,
    private paymentDataSource: PaymentDataSource,
    private notificationDataSource: NotificationDataSource,
  ) {}
  // Order
  saveOrder(order: OrderDataSourceDto): Promise<OrderDataSourceDto> {
    return this.generalDataSource.saveOrder(order);
  }

  findOrderById(id: string): Promise<OrderDataSourceDto | null> {
    return this.generalDataSource.findOrderById(id);
  }
  findByOrderItemId(id: string): Promise<OrderDataSourceDto | null> {
    return this.generalDataSource.findByOrderItemId(id);
  }

  deleteOrder(order: OrderDataSourceDto): Promise<void> {
    return this.generalDataSource.deleteOrder(order);
  }

  deleteOrderItem(orderItem: string): Promise<void> {
    return this.generalDataSource.deleteOrderItem(orderItem);
  }

  getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<OrderDataSourcePaginationDto> {
    return this.generalDataSource.getAllOrders(page, limit, status, storeId);
  }

  getFilteredAndSortedOrders(storeId: string): Promise<OrderFilteredDto> {
    return this.generalDataSource.getFilteredAndSortedOrders(storeId);
  }

  // Store/Totem
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByEmail(email);
  }
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByCnpj(cnpj);
  }
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByName(name);
  }
  findStoreById(id: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreById(id);
  }
  saveStore(store: StoreDataSourceDTO): Promise<void> {
    return this.generalDataSource.saveStore(store);
  }
  findStoreByTotemAccessToken(
    accessToken: string,
  ): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByTotemAccessToken(accessToken);
  }

  // Product/Category
  findAllCategoriesByStoreId(
    storeId: string,
  ): Promise<CategoryDataSourceDTO[]> {
    return this.generalDataSource.findAllCategoriesByStoreId(storeId);
  }
  saveCategory(categoryDTO: CategoryDataSourceDTO): Promise<void> {
    return this.generalDataSource.saveCategory(categoryDTO);
  }
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null> {
    return this.generalDataSource.findCategoryById(id);
  }
  findCategoryByNameAndStoreId(
    name: string,
    storeId: string,
  ): Promise<CategoryDataSourceDTO | null> {
    return this.generalDataSource.findCategoryByNameAndStoreId(name, storeId);
  }
  async findProductsById(
    productIds: string[],
  ): Promise<ProductDataSourceDTO[]> {
    return this.generalDataSource.findProductsById(productIds);
  }

  // Payment
  findPaymentById(paymentId: string): Promise<PaymentDataSourceDTO | null> {
    return this.generalDataSource.findPaymentById(paymentId);
  }
  findPaymentByOrderId(orderId: string): Promise<PaymentDataSourceDTO | null> {
    return this.generalDataSource.findPaymentByOrderId(orderId);
  }
  savePayment(paymentDTO: PaymentDataSourceDTO): Promise<void> {
    return this.generalDataSource.savePayment(paymentDTO);
  }
  createPaymentExternal(
    paymentDTO: PaymentExternalDataSourceDTO,
  ): Promise<PaymentCreateExternalDataSourceResponseDTO> {
    return this.paymentDataSource.createPaymentExternal(paymentDTO);
  }

  // Customer
  findCustomerById(id: string): Promise<CustomerDataSourceDTO | null> {
    return this.generalDataSource.findCustomerById(id);
  }
  findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null> {
    return this.generalDataSource.findCustomerByCpf(cpf);
  }
  findCustomerByEmail(email: string): Promise<CustomerDataSourceDTO | null> {
    return this.generalDataSource.findCustomerByEmail(email);
  }
  findAllCustomers(
    paginatedParams: PaginatedDataSourceParamsDTO,
    filters: FindAllCustomersDataSourceFiltersDTO,
  ): Promise<PaginatedDataSourceResponseDTO<CustomerDataSourceDTO>> {
    return this.generalDataSource.findAllCustomers(paginatedParams, filters);
  }
  saveCustomer(customer: CustomerDataSourceDTO): Promise<void> {
    return this.generalDataSource.saveCustomer(customer);
  }

  // Notification
  sendSMSNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }> {
    return this.notificationDataSource.sendSMSNotification(phone, message);
  }
  sendWhatsappNotification(
    phone: string,
    message: string,
  ): Promise<{ error?: string }> {
    return this.notificationDataSource.sendWhatsappNotification(phone, message);
  }
  sendEmailNotification(
    email: string,
    message: string,
  ): Promise<{ error?: string }> {
    return this.notificationDataSource.sendEmailNotification(email, message);
  }
  sendMonitorNotification(
    ip: string,
    message: string,
  ): Promise<{ error?: string }> {
    return this.notificationDataSource.sendMonitorNotification(ip, message);
  }
  saveNotification(notification: NotificationDataSourceDTO): Promise<void> {
    return this.generalDataSource.saveNotification(notification);
  }
}
