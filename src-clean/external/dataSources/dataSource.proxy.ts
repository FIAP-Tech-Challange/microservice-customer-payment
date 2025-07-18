import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from './general/general.dataSource';
import { PaymentDataSource } from './payment/payment.dataSource';
import { PaymentDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentDataSource.dto';
import { OrderDataSourceDto } from 'src-clean/common/dataSource/DTOs/orderDataSource.dto';
import { ProductDataSourceDTO } from 'src-clean/common/dataSource/DTOs/productDataSource.dto';
import { OrderDataSourcePaginationDto } from 'src-clean/common/dataSource/DTOs/orderDataSourcePagination.dto';
import { CustomerDataSourceDTO } from 'src-clean/common/dataSource/DTOs/customerDataSource.dto';
import { PaginatedDataSourceParamsDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src-clean/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceResponseDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { CategoryDataSourceDTO } from 'src-clean/common/dataSource/DTOs/categoryDataSource.dto';
import { PaymentCreateExternalDataSourceResponseDTO } from 'src-clean/common/dataSource/DTOs/paymentCreateExternalDataSourceResponse.dto';
import { PaymentExternalDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentExternalDataSource.dto';
import { OrderFilteredDto } from 'src-clean/core/modules/order/DTOs/order-filtered.dto';

export class DataSourceProxy implements DataSource {
  constructor(
    private generalDataSource: GeneralDataSource,
    private paymentDataSource: PaymentDataSource,
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

  // Store
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

  findProductById(id: string): Promise<ProductDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  saveProduct(product: ProductDataSourceDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findProductByName(
    name: string,
  ): ProductDataSourceDTO | PromiseLike<ProductDataSourceDTO | null> | null {
    throw new Error('Method not implemented.');
  }

  // Payment
  findPaymentById(paymentId: string): Promise<PaymentDataSourceDTO | null> {
    return this.generalDataSource.findPaymentById(paymentId);
  }
  rejectPaymentExternal(externalId: string): Promise<void> {
    return this.paymentDataSource.rejectPaymentExternal(externalId);
  }
  approvePaymentExternal(externalId: string): Promise<void> {
    return this.paymentDataSource.approvePaymentExternal(externalId);
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
  deleteCustomer(id: string): Promise<void> {
    return this.generalDataSource.deleteCustomer(id);
  }
}
