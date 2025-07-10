import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { StoreDataSourceDTO } from './DTOs/storeDataSource.dto';
import { ProductDataSourceDTO } from './DTOs/productDataSource.dto';
import { CategoryDataSourceDTO } from './DTOs/categoryDataSource.dto';
import {
  CustomerDataSourceDTO,
  CustomerPaginationDataSourceDTO,
  FindAllCustomersParamsDTO,
} from './DTOs/customerDataSource.dto';

export interface DataSource {
  saveCategory(categoryDTO: void): unknown;
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null>;
  findCategoryByName(name: string): Promise<CategoryDataSourceDTO | null>;
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null>;
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null>;
  findStoreById(id: string): Promise<StoreDataSourceDTO | null>;
  saveStore(store: StoreDataSourceDTO): Promise<void>;
  findProductById(id: string): Promise<ProductDataSourceDTO | null>;
  saveProduct(product: ProductDataSourceDTO): Promise<void>;
  findProductByName(
    name: string,
  ): ProductDataSourceDTO | PromiseLike<ProductDataSourceDTO | null> | null;
  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null>;

  // Customer methods
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
