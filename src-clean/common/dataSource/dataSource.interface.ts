import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { StoreDataSourceDTO } from './DTOs/storeDataSource.dto';
import { ProductDataSourceDTO } from './DTOs/productDataSource.dto';
import { CategoryDataSourceDTO } from './DTOs/categoryDataSource.dto';
import { TotemDataSourceDTO } from './DTOs/totemDataSource.dto';
import {
  CustomerDataSourceDTO,
  CustomerPaginationDataSourceDTO,
  FindAllCustomersParamsDTO,
} from './DTOs/customerDataSource.dto';

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
  saveProduct(product: ProductDataSourceDTO): Promise<void>;
  findProductById(id: string): Promise<ProductDataSourceDTO | null>;
  findProductByNameAndStoreId(
    name: string,
    storeId: string,
  ): Promise<ProductDataSourceDTO | null>;
  saveCategory(categoryDTO: CategoryDataSourceDTO): Promise<void>;
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null>;
  findCategoryByNameAndStoreId(
    name: string,
    storeId: string,
  ): Promise<CategoryDataSourceDTO | null>;

  // Payment
  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null>;

  // Customer
  findCustomerById(id: string): Promise<CustomerDataSourceDTO | null>;
  findCustomerByCpf(cpf: string): Promise<CustomerDataSourceDTO | null>;
  findAllCustomers(
    params: FindAllCustomersParamsDTO,
  ): Promise<CustomerPaginationDataSourceDTO>;
  findCustomersForUseCase(
    params: FindAllCustomersParamsDTO,
  ): Promise<CustomerDataSourceDTO[]>;
  saveCustomer(customer: CustomerDataSourceDTO): Promise<void>;
  updateCustomer(customer: CustomerDataSourceDTO): Promise<void>;
  deleteCustomer(id: string): Promise<void>;
}
