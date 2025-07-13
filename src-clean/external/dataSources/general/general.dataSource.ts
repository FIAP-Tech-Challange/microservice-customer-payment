import { CategoryDataSourceDTO } from 'src-clean/common/dataSource/DTOs/categoryDataSource.dto';
import { CustomerDataSourceDTO } from 'src-clean/common/dataSource/DTOs/customerDataSource.dto';
import { FindAllCustomersDataSourceFiltersDTO } from 'src-clean/common/dataSource/DTOs/findAllCustomersDataSourceFilters.dto';
import { PaginatedDataSourceParamsDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceParams.dto';
import { PaginatedDataSourceResponseDTO } from 'src-clean/common/dataSource/DTOs/paginatedDataSourceResponse.dto';
import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { TotemDataSourceDTO } from 'src-clean/common/dataSource/DTOs/totemDataSource.dto';

export interface GeneralDataSource {
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
}
