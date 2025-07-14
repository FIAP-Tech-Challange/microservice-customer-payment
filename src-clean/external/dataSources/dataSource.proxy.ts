import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from './general/general.dataSource';
import { PaymentDataSource } from './payment/payment.dataSource';
import { PaymentDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentDataSource.dto';
import { TotemDataSourceDTO } from 'src-clean/common/dataSource/DTOs/totemDataSource.dto';
import { CustomerDataSourceDTO } from 'src-clean/common/dataSource/DTOs/customerDataSource.dto';
import { PaginatedDataSourceParamsDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src-clean/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceResponseDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { CategoryDataSourceDTO } from 'src-clean/common/dataSource/DTOs/categoryDataSource.dto';

export class DataSourceProxy implements DataSource {
  constructor(
    private generalDataSource: GeneralDataSource,
    private paymentDataSource: PaymentDataSource,
  ) {}

  // Totem
  findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null> {
    return this.generalDataSource.findTotemByAccessToken(accessToken);
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

  // Payment
  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null> {
    return this.paymentDataSource.getPayment(paymentId);
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
